import { useContext, useState } from 'react';
import { Context } from '../context/Context';

export default function TaskCard({ task }) {
  if (!task) {
    return null; // o mostrar un mensaje de error o hacer algo más apropiado para tu caso
  }

  const images = task.images || [];
 // Verificar si task.images existe, si no, usar un array vacío

  const { deleteProduct, updateProduct } = useContext(Context);
  const [editing, setEditing] = useState(false);
  const [name, setName] = useState(task.name);
  const [description, setDescription] = useState(task.description);
  const [price, setPrice] = useState(task.price);
  const [image, setImage] = useState(images[0]); // Usar el array images en lugar de task.images

  const handleEdit = () => {
    setEditing(true);
  };

  const handleCancel = () => {
    setEditing(false);
  };

  const handleSave = () => {
    updateProduct(task._id, {
      name,
      description,
      price,
      image,
    });
    setEditing(false);
  };

  const handleDelete = () => {
    deleteProduct(task._id);
  };

  return (
    <div className='bg-slate-800 text-white p-4 rounded-md m-4'>
      {editing ? (
        <div className='flex flex-col'>
          <label htmlFor='name'>Nombre:</label>
          <input
            type='text'
            id='name'
            value={name}
            onChange={(e) => setName(e.target.value)}
            className='my-2 p-1 rounded-md border-gray-400 text-black bg-white'
          />
          <label htmlFor='description'>Descripción:</label>
          <textarea
            id='description'
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className='my-2 p-1 rounded-md border-gray-400 text-black bg-white h-20'
          />
          <label htmlFor='price'>Precio:</label>
          <input
            type='number'
            id='price'
            value={price}
            onChange={(e) => setPrice(e.target.value)}
            className='my-2 p-1 rounded-md border-gray-400 text-black bg-white'
          />
          <input
            type='text'
            id='image'
            value={image}
            onChange={(e) => setImage(e.target.value)}
            className='my-2 p-1 rounded-md border-gray-400 text-black bg-white'
          />
          <div className='flex'>
            <button
              onClick={handleSave}
              className='bg-green-500 px-2 py-1 mr-2 rounded-md hover:bg-green-400'
            >
              Guardar
            </button>
            <button
              onClick={handleCancel}
              className='bg-red-500 px-2 py-1 rounded-md hover:bg-red-400'
            >
              Cancelar
            </button>
          </div>
        </div>
      ) : (
        <>
          <h1 className='text-xl font-bold capitalize'>{name}</h1>
          <h1 className='text-gray-400'> {price} </h1>
          <p className='text-gray-400 overflow-auto max-h-24'>{description}</p>
          {image && <img src={`http://localhost:3002/products/${image}`} alt={name} />}


          <div className='flex'>
            <button
              onClick={handleEdit}
              className='bg-blue-500 px-2 py-1 mr-2 rounded-md hover:bg-blue-400'
            >
              Editar
            </button>
            <button
              onClick={handleDelete}
              className='bg-red-500 px-2 py-1 rounded-md hover:bg-red-400'
            >
              Eliminar
            </button>
          </div>
        </>
      )}
    </div>
  );
}