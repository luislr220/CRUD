import './App.css';
import TaskList from './components/Tasklist';
import Form from './components/Form';

function App() {
    return (
        <main className='bg-zinc-900 h-max'>
            <div className='container mx-auto p-10'>
                <Form />
                <TaskList />
            </div>
        </main>
    )
}

export default App
