import {StatusBar} from 'expo-status-bar';
import {Pressable, StyleSheet, Text, TextInput, View, FlatList, Alert, Button} from 'react-native';
import {useEffect, useState} from "react";
import * as SQLite from 'expo-sqlite';

export default function App() {
    const [item, setItem] = useState("");
    const [amount, setAmount] = useState("");
    const [list, setList] = useState([]);

    const db = SQLite.openDatabase('shopping_list.db');

    const addItem = () => {
        db.transaction(tx => {
                tx.executeSql(
                    'INSERT INTO shoppingList (name, amount) VALUES (?,?);',
                    [item, amount]
                );
            }, error => {
                console.log(error);
                Alert.alert('An error occurred ' + error);
            },
            updateList);
        setItem('');
        setAmount('');
    }

    const deleteItem = (item) => {
        db.transaction(tx => {
            tx.executeSql('DELETE FROM shoppingList WHERE id = ?;', [item.id]);
        }, error => {
            console.log(error);
            Alert.alert('An error occurred ' + error);
        }, () => {
            console.log('Item ' + item.id + ' successfully deleted!');
            updateList();
        })
    }

    const updateList = () => {
        console.log("Table updated or created!");
        db.transaction(tx => {
            tx.executeSql(
                'SELECT * FROM shoppingList;',
                [],
                (_, {rows}) =>
                    setList(rows._array)
            );
        }, error => {
            console.log(error);
            Alert.alert('An error occurred: ' + error);
        }, null);
    }

    useEffect(() => {
        db.transaction(tx => {
            tx.executeSql(
                'CREATE TABLE IF NOT EXISTS shoppingList (id INTEGER PRIMARY KEY NOT NULL, name TEXT, amount TEXT);'
            );
        }, error => {
            console.log(error);
            Alert.alert('An error occurred ' + error)
        }, updateList);
    }, []);


    return (
        <View style={styles.container}>
            <TextInput
                keyboardType="default"
                style={styles.textInput}
                onChangeText={item => setItem(item)} value={item}
                placeholder='Item'
                textAlign='center'
            />
            <TextInput
                keyboardType="default"
                style={styles.textInput}
                onChangeText={amount => setAmount(amount)} value={amount}
                placeholder='Amount'
                textAlign='center'
            />
            <View style={{flexDirection: 'row', justifyContent: 'center'}}>
                <Pressable
                    style={styles.button}
                    onPress={addItem}>
                    <Text style={styles.text}>Add</Text>
                </Pressable>
            </View>
            <Text style={styles.listTitle}>Shopping List</Text>
            <View style={styles.list}>
                <FlatList
                    data={list}
                    renderItem={
                        ({item}) =>
                            <View style={{flexDirection: 'row', justifyContent: 'center'}}>
                                <Text style={styles.result}>{item.name} {item.amount}</Text>
                                <Pressable onPress={() => deleteItem(item)}>
                                    <Text style={{fontSize: 16, color: 'blue', padding: 5}}>Bought</Text>
                                </Pressable>
                            </View>
                    }
                />
            </View>
            <StatusBar style="auto"/>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
        alignItems: 'center',
        justifyContent: 'center',
        paddingTop: 44,
        paddingBottom: 11,
    },
    textInput: {
        borderColor: "#000",
        height: 44,
        marginTop: 11,
        marginBottom: 5,
        width: 200,
        borderWidth: 1
    },
    result: {
        padding: 5,
        fontSize: 16
    },
    button: {
        paddingVertical: 11,
        paddingHorizontal: 11,
        marginTop: 11,
        backgroundColor: 'lightblue',
        marginHorizontal: 11
    },
    list: {
        borderColor: "black",
        borderWidth: 0.5,
        borderStyle: 'dotted',
        width: '90%',
        flex: 15,
        alignItems: 'center',
        backgroundColor: 'white',
        justifyContent: 'center',
    },
    listTitle: {
        fontSize: 25,
        backgroundColor: "lightblue",
        width: '90%',
        textAlign: 'center'
    }
});