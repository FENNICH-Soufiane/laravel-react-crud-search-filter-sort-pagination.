import axios from 'axios';
import React, { useEffect, useState } from 'react';
import useCategories from '../../custom/useCategories';
import { useDebounce } from 'use-debounce';
import Swal from 'sweetalert2'
import { Link } from 'react-router-dom';

const Tasks = () => {
  const [tasks, setTasks] = useState([]);
  const [categories, setCategories] = useState([]);
  const [page, setPage] = useState(1);
  const [catId, setCatId] = useState(null);
  const [orderBy, setOrderBy] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const debouncedSearchTerm = useDebounce(searchTerm, 300);
  console.log(debouncedSearchTerm);

  const fetchTasks = async () => {
    try {
      if (catId) {
        const response = await axios.get(`api/category/${catId}/tasks?page=${page}`);
        setTasks(response.data);
      } else if (orderBy) {
        const response = await axios.get(`api/order/${orderBy.column}/${orderBy.direction}/tasks/?page=${page}`);
        setTasks(response.data);
      } else if (debouncedSearchTerm[0] !== '') {
        const response = await axios.get(`api/search/${debouncedSearchTerm[0]}/tasks/?page=${page}`);
        setTasks(response.data);
      }
      else {
        const response = await axios.get(`api/tasks?page=${page}`);
        setTasks(response.data); // Utilisez response.data ici
        console.log(response.data); // Affichez la réponse directement ici
      }
    } catch (error) {
      console.log(error);
    }
  };


  useEffect(() => {
    // ces condition pour eviter l'appel continue de l'api en cas d'absence de besoin
    if (!categories.length) {
      fetchCategories();
    }
    if (!tasks.length) {
      fetchTasks();
    }
  }, [page, catId, orderBy, debouncedSearchTerm[0]]);


  const checkIfTaskIsDone = (done) => (
    done ?
      (
        <span className="badge text-bg-success">Done</span>
      )
      :
      (
        <span className="badge text-bg-danger">Processing</span>
      )
  );


  // for pagination
  // see also renderPagination
  const fetchPrevNextTasks = (link) => {

    const url = new URL(link);
    setPage(url.searchParams.get('page'));
    console.log(url)
  }

  const deleteTask = (taskId) => {
    Swal.fire({
      title: "Are you sure?",
      text: "You won't be able to revert this!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, delete it!"
      // ajouter async
    }).then(async (result) => {
      
      if (result.isConfirmed) {
        try {
          const response = await axios.delete(`api/tasks/${taskId}`);
          Swal.fire({
            title: "Deleted!",
            // text: "Your file has been deleted.",
            text: response.data.message,
            icon: "success"
          });  
          fetchTasks();   
        } catch (error) {
          console.log(error);
        }
        
      }
    });
  }

  const renderPagination = () => (
    <ul className="pagination">
      {
        tasks.links?.map((link, index) => (
          <li className={`page-item ${link.active ? 'active' : ''}`} key={index}>
            <a onClick={() => fetchPrevNextTasks(link.url)} className="page-link" style={{ cursor: 'pointer' }} >
              {link.label.replace('&laquo;', '').replace('&raquo;', '')}
            </a>
          </li>
        ))
      }
    </ul>
  )

  const fetchCategories = async () => {
    const fetchedCategories = await useCategories();
    setCategories(fetchedCategories);
  }

  return (
    <>
      <div className="row my-5">
        {/* Section de search */}
        <div className="row my-3">
          <div className="col-md-4">
            <div className="form-group">
              <input value={searchTerm} type="text" className='form-control rounded-0 border-dark'
                placeholder='Search ...'
                onChange={(event) => {
                  setCatId(null); setOrderBy(null); setPage(1);
                  setSearchTerm(event.target.value)
                }}
              />
            </div>
          </div>
        </div>
        <div className="col-md-9 card">
          {/* Section d'affichage de données */}
          <div className="card-body">
            <table className="table">
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Title</th>
                  <th>Body</th>
                  <th>Done</th>
                  <th>Category</th>
                  <th>Created</th>
                  <th></th>
                  <th></th>
                </tr>
              </thead>
              <tbody>
                {tasks?.data?.map((task) => (
                  <tr key={task.id}>
                    <td>{task.id}</td>
                    <td>{task.title}</td>
                    <td>{task.body}</td>
                    <td>{checkIfTaskIsDone(task.done)}</td>
                    <td>{task.category.name}</td>
                    <td>{task.created_at}</td>
                    <td>
                      <Link to={`/edit/${task.id}`} className="btn btn-sm btn-warning mx-1">
                        <i className="fas fa-pen"></i>
                      </Link>
                    </td>
                    <td>
                    <button onClick={() => deleteTask(task.id)} className="btn btn-sm btn-danger mx-1">
                        <i className="fas fa-trash"></i>
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            <div className="my-4 d-flex justify-content-between">
              <div>Showing {tasks.from || 0} to {tasks.to || 0} from {tasks.total} results.</div>
              <div>{renderPagination()}</div>
            </div>
          </div>
        </div>
        {/* Section de Filter */}
        <div className="col-md-3">
          {/* Filter par category */}
          <div className="card">
            <div className="card-header text-center bg-white">
              <h5 className='mt-2'>Filter by category</h5>
            </div>
            <div className="card-body">
              <div className="form-check">
                <input type="radio" name='category' id='category' className='form-check-input'
                  onChange={() => { setCatId(null); setPage(1); setOrderBy(null) }}
                  checked={!catId ? true : false}
                />
                <label htmlFor="category" className='form-check-label'>All</label>
              </div>
              {
                categories?.map((category, index) => (
                  <div key={index} className="form-check">
                    <input type="radio" name='category' id={category.id} value={category.id}
                      className='form-check-input'
                      onChange={(event) => { setPage(1); setCatId(event.target.value); setOrderBy(null) }}
                      // !!
                      checked={catId == category.id}
                    />
                    <label htmlFor={category.id} className='form-check-label'>{category.name}</label>
                  </div>
                ))

              }
            </div>
          </div>


          <div className="card mt-2">
            <div className="card-header text-center bg-white">
              <h5 className="mt-2">
                Order by
              </h5>
            </div>
            <div className="bard-body">
              {/* Filter par order */}
              <div>
                <h3>ID</h3>
                <div className="form-check">
                  <input value="asc" type="radio" name='order' id='orderAs' className='form-check-input'
                    onChange={(event) => { setCatId(null); setPage(1); setOrderBy({ column: 'id', direction: event.target.value }) }}
                    checked={orderBy && orderBy.column === 'id' && orderBy.direction === 'asc' ? true : false}
                  />
                  <label htmlFor="orderAs" className='form-check-label'><i className="fas fa-arrow-up"></i></label>
                </div>
                <div className="form-check">
                  <input value="desc" type="radio" name='order' id='orderDes' className='form-check-input'
                    onChange={(event) => { setCatId(null); setPage(1); setOrderBy({ column: 'id', direction: event.target.value }) }}
                    checked={orderBy && orderBy.column === 'id' && orderBy.direction === 'desc' ? true : false}
                  />
                  <label htmlFor="orderDes" className='form-check-label'><i className="fas fa-arrow-down"></i></label>
                </div>
              </div>
              <hr />
              {/* Filter par title */}
              <div>
                <h3>Title</h3>
                <div className="form-check">
                  <input value="asc" type="radio" name='order' id='orderAsTitle' className='form-check-input'
                    onChange={(event) => { setCatId(null); setPage(1); setOrderBy({ column: 'title', direction: event.target.value }) }}
                    checked={orderBy && orderBy.column === 'title' && orderBy.direction === 'asc' ? true : false}
                  />
                  <label htmlFor="orderAsTitle" className='form-check-label'>A to Z</label>
                </div>
                <div className="form-check">
                  <input value="desc" type="radio" name='order' id='orderDesTitle' className='form-check-input'
                    onChange={(event) => { setCatId(null); setPage(1); setOrderBy({ column: 'title', direction: event.target.value }) }}
                    checked={orderBy && orderBy.column === 'title' && orderBy.direction === 'desc' ? true : false}
                  />
                  <label htmlFor="orderDesTitle" className='form-check-label'>Z to A</label>
                </div>
              </div>
            </div>
          </div>
        </div>



      </div>
    </>
  );
};

export default Tasks;
