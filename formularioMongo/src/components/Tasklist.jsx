import { useEffect, useContext } from 'react';
import { Context } from '../context/Context';
import TaskCard from './TaskCard';

function TaskList() {
  const { products, setProducts, deleteProduct } = useContext(Context);

  useEffect(() => {
    fetch('http://localhost:3002/products/')
      .then(response => response.json())
      .then(data => {
        setProducts(data);
      })
      .catch(err => console.log(err.message))
  }, [setProducts]);

  function handleDelete(productId) {
    deleteProduct(productId);
  }

  if (!Array.isArray(products) || products.length === 0) {
    return (
      <h1 className='text-white text-4xl font-bold text-center'>
        Aún no hay tareas
      </h1>
    );
  }

  return (
    <div className='grid grid-cols-4 gap-2'>
      {products.map(task => (
        <TaskCard key={task._id} task={task} handleDelete={handleDelete} />
      ))}
    </div>
  );
  
}

export default TaskList;
