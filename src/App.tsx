import React, { useEffect, useState } from "react";
import { Schema } from "../amplify/auth/resource";
import { generateClient } from "aws-amplify/data";
import { Authenticator } from '@aws-amplify/ui-react';
import { CheckboxField, Input, Button, Flex } from '@aws-amplify/ui-react';
import '@aws-amplify/ui-react/styles.css';

const client = generateClient<Schema>();

function App() {
    const [todos, setTodos] = useState<Array<Schema["Todo"]["type"]>>([]);
    const [motivations, setMotivations] = useState<string[]>([]);
    const [taskNumber, setTaskNumber] = useState<number>(1);
    const [interests, setInterests] = useState<string[]>([]);
    const [showTodo, setshowTodo] = useState(false);
    const [showmotivations, setshowMotivations] = useState<string[]>([]);
    const [showtaskNumber, setshowTaskNumber] = useState(0);
    const [showinterests, setshowInterests] = useState<string[]>([]);

    const handleMotivationsChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const value = event.target.value;
        setMotivations(prev =>
            event.target.checked ? [...prev, value] : prev.filter(motivation => motivation !== value)
        );
    };

    const handleTaskNumberChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setTaskNumber(parseInt(event.target.value));
    };

    const handleInterestsChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const value = event.target.value;
        setInterests(prev =>
            event.target.checked ? [...prev, value] : prev.filter(interest => interest !== value)
        );
    };

    const createTodo = async () => {
        try {
            const todoContent = JSON.stringify({
                motivations: motivations,
                taskNumber: taskNumber,
                interests: interests
            });

            await client.models.Todo.create({
                content: todoContent
            });

            fetchTodos();
        } catch (error) {
            console.error('Error creating Todo:', error);
            // Handle error appropriately
        }
        setshowTodo(true);
    };

    const fetchTodos = async () => {
        const { data: todos, errors } = await client.models.Todo.list();
        console.log(errors);
        setTodos(todos);

        console.log(todos);
        const lastElement = todos[todos.length - 1];
        console.log(lastElement);
        const contentObj = JSON.parse(lastElement.content);
        const { motivations, taskNumber, interests } = contentObj;
        setshowMotivations(motivations);
        setshowTaskNumber(taskNumber);
        setshowInterests(interests);

    };





    useEffect(() => {
        fetchTodos();
        console.log(todos);

    }, []);



    if (showTodo) {
        return (
            <div>
                <h2>Motivations:</h2>
                <ul>
                    {showmotivations.map((motivation, index) => (
                        <li key={index}>{motivation}</li>
                    ))}
                </ul>
                <p>Task Number: {showtaskNumber}</p>
                <h2>Interests:</h2>
                <ul>
                    {showinterests.map((interest, index) => (
                        <li key={index}>{interest}</li>
                    ))}
                </ul>
            </div>
        );
    } else {
        return (
            <Authenticator>
                {({ signOut }) => (
                    <main>
                        <Button onClick={signOut} style={{ position: 'absolute', top: '10px', right: '10px', zIndex: '1000', color: 'white' }}>Sign Out</Button>
                        <Flex as="form" direction="column" width="50rem">
                            <h1>Some questions to get to know you better</h1>

                            <div className="question">
                                <h2>What are you hoping to gain from this gameplay?</h2>

                                <Flex>
                                    <CheckboxField
                                        label="Maintain personal hygiene"
                                        value="maintain personal hygiene"
                                        name="maintain personal hygiene"
                                        onChange={handleMotivationsChange}
                                    />
                                    <br />
                                    <CheckboxField
                                        label="Stay fit and exercise"
                                        value="stay fit and exercise"
                                        name="stay fit and exercise"
                                        onChange={handleMotivationsChange}
                                    />
                                    <br />
                                    <CheckboxField
                                        label="Stay tidy and clean"
                                        value="stay tidy and clean"
                                        name="stay tidy and clean"
                                        onChange={handleMotivationsChange}
                                    />
                                    <br />
                                </Flex>
                            </div>

                            <div className="question">
                                <h2>How many tasks would you like to work on a day?</h2>
                                <Input type="number" id="taskNumber" min="1" max="10" value={taskNumber} width="10rem" onChange={handleTaskNumberChange} />
                            </div>

                            <div className="question">
                                <h2>What are your interests?</h2>

                                <Flex>
                                    {['animals', 'music', 'tech', 'sports', 'space', 'dinosaurs', 'fantasy', 'city', 'nature'].map(interest => (
                                        <CheckboxField name={interest} key={interest} label={interest} value={interest} onChange={handleInterestsChange} />
                                    ))}
                                </Flex>
                            </div>

                            <Button onClick={createTodo}>Give me my tasks!</Button>

                        </Flex>

                    </main>
                )}
            </Authenticator>
        );
    }
}

export default App;