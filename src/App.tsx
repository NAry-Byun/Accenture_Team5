import React, { useEffect, useState } from "react";
import { Schema } from "../amplify/data/resource";
import { generateClient } from "aws-amplify/data";
import { Authenticator } from '@aws-amplify/ui-react';
import '@aws-amplify/ui-react/styles.css';

const client = generateClient<Schema>();

function App() {
  const [todos, setTodos] = useState<Array<Schema["Todo"]["type"]>>([]);
  const [motivations, setMotivations] = useState<string[]>([]);
  const [taskNumber, setTaskNumber] = useState<number>(1);
  const [interests, setInterests] = useState<string[]>([]);

  useEffect(() => {
    client.models.Todo.observeQuery().subscribe({
      next: (data) => setTodos([...data.items]),
    });
  }, []);

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

  const handleSubmit = () => {
    console.log('Motivations:', motivations);
    console.log('Task Number:', taskNumber);
    console.log('Interests:', interests);
  };

  // function createTodo() {
  //   const content = window.prompt("Todo content");
  //   if (content) {
  //     client.models.Todo.create({ content });
  //   }
  // }

  // function deleteTodo(id: string) {
  //   client.models.Todo.delete({ id });
  // }

  return (
    <Authenticator>
      {({ signOut, user }) => (
        <main>
          <h1>Some questions to get to know you better</h1>
          
          <div className="question">
            <h2>What are you hoping to gain from this gameplay?</h2>
            <div>
              <label><input type="checkbox" value="maintain personal hygiene" onChange={handleMotivationsChange} /> Maintain personal hygiene</label><br />
              <label><input type="checkbox" value="stay fit and exercise" onChange={handleMotivationsChange} /> Stay fit and exercise</label><br />
              <label><input type="checkbox" value="stay tidy and clean" onChange={handleMotivationsChange} /> Stay tidy and clean</label><br />
            </div>
          </div>

          <div className="question">
            <h2>How many tasks would you like to work on a day?</h2>
            <input type="number" id="taskNumber" min="1" max="10" value={taskNumber} onChange={handleTaskNumberChange} />
          </div>

          <div className="question">
            <h2>What are your interests?</h2>
            <div>
              {['animals', 'music', 'tech', 'sports', 'space', 'dinosaurs', 'fantasy', 'city', 'nature'].map(interest => (
                <label key={interest}>
                  <input type="checkbox" value={interest} onChange={handleInterestsChange} /> {interest}
                </label>
              ))}
            </div>
          </div>
          <br />
          <button onClick={handleSubmit}>Give me my tasks!</button>

          {/* <h2>Todos</h2>
          <button onClick={createTodo}>+ new</button>
          <ul>
            {todos.map(todo => (
              <li key={todo.id} onClick={() => deleteTodo(todo.id)}>
                {todo.content}
              </li>
            ))}
          </ul>

          <div>
            🥳 App successfully hosted. Try creating a new todo.
            <br />
            <a href="https://docs.amplify.aws/react/start/quickstart/#make-frontend-updates">
              Review next step of this tutorial.
            </a>
          </div> */}
          {/* <button onClick={signOut}>Sign out</button> */}
          {/* <br />
          <button type="button">Give me my tasks!</button> */}
        </main>
      )}
    </Authenticator>
  );
}

export default App;
