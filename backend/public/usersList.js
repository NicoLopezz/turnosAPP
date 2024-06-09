// // script.js

// document.addEventListener('DOMContentLoaded', () => {
//     const userList = document.getElementById('user-list');
  
//     // Llamada a la API para obtener los usuarios
//     fetch('http://localhost:10001/api/allUsers')
//       .then(response => response.json())
//       .then(users => {
//         users.forEach(user => {
//           const li = document.createElement('li');
//           li.textContent = `Name: ${user.Name} Surname: ${user.Surname} Email: ${user.Email} Company: ${user.Company}`;
//           userList.appendChild(li);
//         });
//       })
//       .catch(error => console.error('Error al obtener usuarios:', error));
//   });
  
// script.js

document.addEventListener('DOMContentLoaded', () => {
    const userList = document.getElementById('user-list');
  
    // Llamada a la API para obtener los usuarios
    fetch('http://localhost:10001/api/allUsers')
      .then(response => response.json())
      .then(users => {
        users.forEach(user => {
          const card = document.createElement('div');
          card.classList.add('card');
  
          const userName = document.createElement('h2');
          userName.textContent = `Name: ${user.Name}`
          const userSurname = document.createElement('h2');
          userSurname.textContent = `Surname: ${user.Surname}`
          const userEmail = document.createElement('h2');
          userEmail.textContent = `Email: ${user.Email}`
          const userCompany = document.createElement('h2');
          userCompany.textContent = `Company: ${user.Company}`
          
          
        //   Surname: ${user.Surname} Email: ${user.Email} Company: ${user.Company}`;
  
          // Agregar otros datos del usuario si es necesario
          // Por ejemplo:
          // const userEmail = document.createElement('p');
          // userEmail.textContent = `Email: ${user.email}`;
  
          card.appendChild(userName);
          card.appendChild(userSurname); // Agregar otros datos si es necesario
          card.appendChild(userEmail); // Agregar otros datos si es necesario
          card.appendChild(userCompany); // Agregar otros datos si es necesario
  
          userList.appendChild(card);
        });
      })
      .catch(error => console.error('Error al obtener usuarios:', error));
  });
  