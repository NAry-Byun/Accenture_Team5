// import React, { useEffect, useState } from "react";
// import { Schema } from "../amplify/auth/resource";
// import { generateClient } from "aws-amplify/data";

// import { CheckboxField, Input, Button, Flex } from '@aws-amplify/ui-react';
// import '@aws-amplify/ui-react/styles.css';

// const client = generateClient<Schema>();

// function Tasks() {
//     const [todos, setTodos] = useState<Array<Schema["Todo"]["type"]>>([]);
//     const [motivations, setMotivations] = useState<string[]>([]);
//     const [taskNumber, setTaskNumber] = useState<number[]>([]);
//     const [interests, setInterests] = useState<string[]>([]);

 

//     const fetchTodos = async () => {
//         const { data: todos, errors } = await client.models.Todo.list();
//         console.log(errors);



//         const parsedTodos = todos.map(todo => {
//             // Parse the JSON content of each todo
//             const parsedContent = JSON.parse(todo.content);
//             return {
        
//                 motivations: parsedContent.motivations,
//                 taskNumber: parsedContent.taskNumber,
//                 interests: parsedContent.interests
//                 // Add more fields as needed
//             };
//         });
//         setTodos(parsedTodos);
//         const allMotivations = parsedTodos.flatMap(todo => todo.motivations);
//         setMotivations(allMotivations);
//         console.log(motivations);

//         const alltaskNumbers = parsedTodos.flatMap(todo => todo.taskNumber);
//         setTaskNumber(alltaskNumbers);
//         console.log(taskNumber);

//         const allInterests = parsedTodos.flatMap(todo => todo.interests);
//         setInterests(allInterests);
//         console.log(interests);


//     };

//     useEffect(() => {
//         fetchTodos();
//         console.log(todos);


//     }, []);


//     return (

   

//                 <main>

//                     <Flex width="50rem">
//                         <h1>Below are the tasks:</h1>
//                     </Flex>

//                 </main>

//     );
// }

// export default Tasks;
