import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom';
import useCategories from '../../custom/useCategories';
import axios from 'axios';
import Swal from 'sweetalert2'


const Create = () => {

  const [title, setTitle] = useState('');
  const [body, setBody] = useState('');
  const [categoryId, setCategoryId] = useState('');
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState('');
  const [errors, setErrors] = useState([]);
  const navigate = useNavigate();


  const fetchCategories = async () => {
    const fetchedCategories = await useCategories();
    setCategories(fetchedCategories);
  }

  const createTask = async (e) => {
    setLoading(true);
    e.preventDefault();
    const task = {
      title,
      body,
      // category_id est le nom du champ dans la base de donnée
      category_id: categoryId
    }
    try {
      await axios.post('api/tasks', task)
      Swal.fire({
        position: "top-end",
        icon: "success",
        title: "Your task has been saved",
        showConfirmButton: false,
        timer: 1500
      });
      setLoading(false);
      navigate('/');
    } catch (error) {
      setLoading(false);
      setErrors(error.response.data.errors)
      console.log(error.response.data.errors);
    }
  }

  const renderErrors = (field) => (
    errors?.[field]?.map((error, index) => (
      <div key={index} className="text-white my-2 rounded p-2 bg-danger">{error}</div>
    )))


  useEffect(() => {
    fetchCategories()
  }, [])

  return (
    <div className='row my-5'>
      <div className="col-md-6 mx-auto">
        <div className="card">
          <div className="card-header bg white">
            <h5 className="text-center mt-2">
              Create new task
            </h5>
          </div>

          <div className="card-body">
            <form className='mt-5' onSubmit={(e) => createTask(e)}>
              <div className="mb-3">
                <label htmlFor="title" className="form-label">Title</label>
                <input value={title} onChange={(e) => setTitle(e.target.value)} type="text" className="form-control" id="title" aria-describedby="emailHelp" />
                {renderErrors('title')}
              </div>
              <div className="mb-3">
                <label htmlFor="body" className="form-label">Body</label>
                <textarea value={body} onChange={(e) => setBody(e.target.value)} className="form-control" name="body" id="body" cols="30" rows="5" placeholder='Body ...'></textarea>
                {renderErrors('body')}
              </div>
              <div className="mb-3">
                <select value={categoryId} onChange={(e) => setCategoryId(e.target.value)} name='category_id' className="form-select" >
                  <option disabled value="">Choose a category</option>
                  {
                    categories.map((category) => (
                      <option key={category.id} value={category.id}>{category.name}</option>
                    ))
                  }
                </select>
                {renderErrors('category_id')}
              </div>
              {
                loading ? (
                  <div className="spinner-border" role="status">
                    <span className="visually-hidden">Loading...</span>
                  </div>
                ) : (
                  <button type="submit" className="btn btn-primary">Submit</button>
                )
              }
            </form>
          </div>

        </div>
      </div>
    </div>
  )
}



export default Create