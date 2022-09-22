// add todo
const add_button = document.getElementById('add-button');
add_button.addEventListener('click', (event) => {
  // prevent from submitting
  event.preventDefault()
  // grabbing the input
  const todo_input = document.getElementById('todo-input').value.trim();
  //empty input not allowed
  if (!todo_input) {
    alert('Empty task name is not allowed! ')
    return
  }
  // console.log(todo_input);
  // generating id based on last items id(+1) 
  // grab the stored list
  let stored_list = JSON.parse(localStorage.getItem('todo_list'))
  // if there is no stored todo_list
  if (!stored_list) {
    stored_list = []
    localStorage.setItem("todo_list", JSON.stringify(stored_list));
    stored_list = JSON.parse(localStorage.getItem('todo_list'));

  }
  let generated_id = 0;
  if (stored_list.length !== 0) {
    generated_id = stored_list[stored_list.length - 1].id + 1;
  }

  show_list(generated_id, todo_input, 'ongoing');
  addToStorage(generated_id, todo_input, 'ongoing')

  // resetting input field
  document.getElementById('todo-input').value = '';
})


// show list
function show_list(id, todo_input, status) {
  const todo_list = document.getElementsByClassName('todo-list')[0];
  const todo_item = document.createElement('li')
  todo_item.innerText = todo_input + ' ';
  // add an id value
  todo_item.id = id;

  const todo_done = document.createElement('button')
  todo_done.innerText = '✅';
  todo_done.addEventListener('click', (event) => {
    const selected_todo = event.target.parentElement;

    selected_todo.classList.toggle('done');
    //
    if (!selected_todo.classList[0]) {
      updateStorage(parseInt(selected_todo.id), 'ongoing');
    }
    else {
      updateStorage(parseInt(selected_todo.id), 'done');
    }
  })
  const todo_delete = document.createElement('button')
  todo_delete.innerText = '❌';
  todo_delete.addEventListener('click', (event) => {
    const selected_todo = event.target.parentElement;
    selected_todo.remove();
    // delete form storage
    updateStorage(parseInt(selected_todo.id), 'delete');
  })
  if (status === 'done') {
    todo_item.classList.add('done')
  }
  todo_item.append(todo_done)
  todo_item.append(todo_delete)
  todo_list.appendChild(todo_item)
}

// update local storage
function addToStorage(id, name, status) {
  let stored_list = JSON.parse(localStorage.getItem("todo_list"));
  if (!stored_list) {
    stored_list = []
  }
  const new_todo = { id: id, name: name, status: status }
  stored_list.push(new_todo);
  localStorage.setItem("todo_list", JSON.stringify(stored_list));
}



// function updateStorage()
function updateStorage(id, action) {
  let stored_list = JSON.parse(localStorage.getItem("todo_list"));
  if (action === 'delete') {
    for (let i = 0; i < stored_list.length; i++) {
      if (stored_list[i].id === id) {
        stored_list.splice(i, 1);
        break
      }
    }
    localStorage.setItem("todo_list", JSON.stringify(stored_list));
  }

  else {
    for (let i = 0; i < stored_list.length; i++) {
      if (stored_list[i].id === id) {
        stored_list[i].status = action;
        break
      }
    }
    localStorage.setItem("todo_list", JSON.stringify(stored_list));
  }

}

// show stored list
function load_list(sort) {
  let retrieved_list = localStorage.getItem("todo_list")
  retrieved_list = JSON.parse(retrieved_list);
  if (!retrieved_list){
      return
  }

  if (sort === 'all') {
      retrieved_list.forEach(i => {
        show_list(i.id, i.name, i.status);
      });
    }
  else if(sort=='done'){
    retrieved_list.forEach(i=>{
      if(i.status==='done'){
        show_list(i.id, i.name, i.status);
      }
    })
  } 
  else if(sort=='pending'){
    let pending_count=0;
    retrieved_list.forEach(i=>{
      if(i.status==='ongoing'){
        show_list(i.id, i.name, i.status);
        pending_count++;
      }
    })
    if(!pending_count){
      const message=document.createElement('p')
      message.innerText='Chill! No Pending Task.'
      document.getElementsByClassName('todo-list')[0].appendChild(message);
      
    }
  }

}

load_list('all')
//sort 

const sort_option=document.getElementById('sort');
sort_option.addEventListener('change',()=>{
  selected_option = document.getElementById('sort').value;
  document.getElementsByClassName('todo-list')[0].innerHTML='';
  load_list(selected_option)

})

