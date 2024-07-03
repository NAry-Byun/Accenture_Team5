import React, { useEffect, useState } from "react";
import { Schema } from "../amplify/data/resource";
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
        await client.models.Todo.create({
            motivation: motivations,
            taskNumber: taskNumber,
            interests: interests
        });
    
    };

    const fetchTodos = async () => {
        const { data: items, errors } = await client.models.Todo.list();
        setTodos(items);
        console.log(todos);
    };

    useEffect(() => {
        fetchTodos();

    }, []);


    return (
        <Authenticator>
            {({ signOut, user }) => (
                <main>
                    <Flex as="form" direction="column" width="50rem">
                        <h1>Some questions to get to know you better</h1>

                        <div className="question">
                            <h2>What are you hoping to gain from this gameplay?</h2>

                            <Flex>
                                <CheckboxField label="Maintain personal hygiene" value="maintain personal hygiene" onChange={handleMotivationsChange} style={{ color: 'white' }} /><br />
                                <CheckboxField label="Stay fit and exercise" value="stay fit and exercise" onChange={handleMotivationsChange} style={{ color: 'white' }} /><br />
                                <CheckboxField label="Stay tidy and clean" value="stay tidy and clean" onChange={handleMotivationsChange} style={{ color: 'white' }} /> <br />
                            </Flex>
                        </div>

                        <div className="question">
                            <h2>How many tasks would you like to work on a day?</h2>
                            <Input style={{ color: 'white' }} type="number" id="taskNumber" min="1" max="10" value={taskNumber} width="10rem" onChange={handleTaskNumberChange} />
                        </div>

                        <div className="question">
                            <h2>What are your interests?</h2>

                            <Flex>
                                {['animals', 'music', 'tech', 'sports', 'space', 'dinosaurs', 'fantasy', 'city', 'nature'].map(interest => (
                                    <CheckboxField style={{ color: 'white' }} key={interest} label={interest} value={interest} onChange={handleInterestsChange} />
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

export default App;
