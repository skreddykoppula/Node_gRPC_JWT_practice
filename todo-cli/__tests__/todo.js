const todoList = require('../todo');


const {all, add, markAsComplete} = todoList();

describe("Test suits", () => {
    beforeAll(() => {
        add(
            {
                title: 'Submit assignment', 
                dueDate: new Date().toISOString().split('T')[0], 
                completed: false 
            }
        );
    });

    test("Add new item into Todo List", () => {
        const TodoItemLength = all.length;
        console.log(all)
        add(
            {
                title: 'Service Vehicle', 
                dueDate: new Date().toISOString().split('T')[0], 
                completed: false
            }
        )

        expect(all.length).toBe(TodoItemLength + 1)
    })


    test("checks marking a todo as completed", () => {
        expect(all[0].completed).toBe(false);
        markAsComplete(0);
        expect(all[0].completed).toBe(true);
    })

})