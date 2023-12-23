import React, { useState, useEffect } from 'react'
import { useNavigate, useParams } from 'react-router-dom';
import useCategories from '../../custom/useCategories';
import axios from 'axios';
import Swal from 'sweetalert2'


const Edit = () => {

  const [title, setTitle] = useState('');
  const [body, setBody] = useState('');
  const [categoryId, setCategoryId] = useState('');
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState('');
  const [errors, setErrors] = useState([]);
  const [done, setDone] = useState(0);
  const navigate = useNavigate();
  const { taskId } = useParams();


  const fetchCategories = async () => {
    const fetchedCategories = await useCategories();
    setCategories(fetchedCategories);
  }

  const updateTask = async (e) => {
    setLoading(true);
    e.preventDefault();
    const task = {
      title,
      body,
      // category_id est le nom du champ dans la base de donnée
      category_id: categoryId,
      done
    }
    try {
      await axios.put(`/api/tasks/${taskId}`, task)
      Swal.fire({
        position: "top-end",
        icon: "success",
        title: "Your task has been updated",
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

  const fetchTask = async () => {
    try {
      const response = await axios.get(`/api/tasks/${taskId}`)
      setTitle(response.data.title);
      setBody(response.data.body);
      setCategoryId(response.data.category_id);
      setDone(response.data.done);
      console.log(response);
    } catch (error) {
      console.log(error);
    }
  }

  useEffect(() => {
    fetchTask()
    fetchCategories()
  }, []);

  return (
    <div className='row my-5'>
      <div className="col-md-6 mx-auto">
        <div className="card">
          <div className="card-header bg white">
            <h5 className="text-center mt-2">
              Edit task
            </h5>
          </div>

          <div className="card-body">
            <form className='mt-5' onSubmit={(e) => updateTask(e)}>
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
              <label htmlFor="category" className="form-label">Category</label>
                <select value={categoryId} onChange={(e) => setCategoryId(e.target.value)} id='category' name='category_id' className="form-select" >
                  <option disabled value="">Choose a category</option>
                  {
                    categories.map((category) => (
                      <option key={category.id} value={category.id}>{category.name}</option>
                    ))
                  }
                </select>
                {renderErrors('category_id')}
              </div>
              <div className="my-3 form-check">
                <input type="checkbox" name="done" id='done' className='form-check-input'
                onChange={() => setDone(!done)}
                value={done}
                checked={done}
                />
                <label htmlFor="done">Done</label>
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



export default Edit