import { useState, useContext } from 'react';
import { Context } from '../context/Context';

function Form({ productId }) {
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: '',
    images: null,
  });

  const { addProduct, updateProduct } = useContext(Context);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.name || !formData.price || !formData.description) {
      console.log('Por favor complete todos los campos');
      return;
    }
  
    try {
      const formDataToSend = new FormData();
      formDataToSend.append('name', formData.name);
      formDataToSend.append('description', formData.description);
      formDataToSend.append('price', formData.price);
      formDataToSend.append('images', formData.images);
  
      let response;
  
      if (productId) {
        // Update product
        response = await fetch(`http://localhost:3002/products/${productId}`, {
          method: 'PUT',
          mode: 'cors',
          body: formDataToSend,
        });
      } else {
        // Create new product
        response = await fetch('http://localhost:3002/products/', {
          method: 'POST',
          body: formDataToSend,
        });
      }
  
      const data = await response.json();

      
      if (productId) {
        updateProduct(data);
      } else {
        addProduct(data);
        setFormData({
          name: '',
          description: '',
          price: '',
          images: null,
        });
      }
    } catch (err) {
      console.log(err.message);
    }
  };
  

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name === 'images') {
      setFormData({
        ...formData,
        images: e.target.files[0],
      });
    } else if (name === 'price') {
      // Verificar que el valor sea un número válido
      if (!isNaN(value)) {
        setFormData(prevState => ({
          ...prevState,
          [name]: value,
        }));
      }
    } else {
      setFormData(prevState => ({
        ...prevState,
        [name]: value,
      }));
    }
  };
  

  return (
    <div>
      <form onSubmit={handleSubmit} className='bg-slate-800 p-10 mb-4'>
        <h1 className='text-2xl font-bold text-white mb-3'>
          {productId ? 'Actualizar producto' : 'Crear producto'}
        </h1>
        <input
          placeholder='Especifica el producto'
          name='name'
          onChange={handleChange}
          value={formData.name}
          autoFocus
          className='bg-slate-300 p-3 w-full mb-2'
        />
        <input
          placeholder='Especifica el precio'
          name='price'
          onChange={handleChange}
          value={formData.price}
          className='bg-slate-300 p-3 w-full mb-2'
        />
        <textarea
          placeholder='Escribe la descripción'
          name='description'
          onChange={handleChange}
          value={formData.description}
          className='bg-slate-300 p-3 w-full mb-2'
        ></textarea>
        <input
          type='file'
          name='images'
          onChange={handleChange}
          accept='image/*'
          className='bg-slate-300 p-3 w-full mb-2'
        />
        <button type='submit' className='bg-indigo-500 px-3 py-1 text-white'>
          {productId ? 'Actualizar' : 'Guardar'}
        </button>
      </form>
    </div>
  );
}

export default Form;