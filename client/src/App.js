import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import Modal from 'react-awesome-modal';
import axios from 'axios';

class App extends Component {

  state = {
    books: [],
    modal: false,
    addModal: false,
    newTitle: '',
    newAuthor: '',
    newISBN: '',
    editTitle: '',
    editAuthor: '',
    editISBN: '',
    editID: ''
  };

  componentDidMount() {
    this.fetchAllBooks()
  }

  renderBooksList() {
    return this.state.books.map(({_id, isbn, title, author}) =>
      <tr key={_id}>
        <td><Link to={`/show/${_id}`}>{isbn}</Link></td>
        <td>{title}</td>
        <td>{author}</td>
        <td style={{width:"175px"}}><button className="btn btn-info" onClick={() => this.openModal(_id, isbn, title, author)} >EDIT</button> <button className="btn btn-danger" onClick={() => this.deleteBook(_id)}>DELETE</button></td>
      </tr>
    )
  }

  openModal(id, isbn, title, author) {
    console.log('Open Modal')
    this.setState({
      modal : true,
      editID: id,
      editTitle: title,
      editAuthor: author,
      editISBN: isbn
    });

  }

  closeModal() {
    console.log('Close Modal')
    this.setState({
      modal : false
    });
  }

  openAddModal(id, isbn, title, author) {
    console.log('Open Modal')
    this.setState({
      addModal : true
    });

  }

  closeAddModal() {
    console.log('Close Modal')
    this.setState({
      addModal : false
    });
  }


  fetchAllBooks() {
    axios.defaults.headers.common['Authorization'] = localStorage.getItem('jwtToken');
    axios.get('http://localhost:5000/api/book')
      .then(res => {
        this.setState({ books: res.data });
        console.log(this.state.books);
      })
  }

  logout = () => {
    localStorage.removeItem('jwtToken');
    window.location.reload();
  }

  createBook = (event) => {
    event.preventDefault();
    const bookdata = {
      title: this.state.newTitle,
      author: this.state.newAuthor,
      isbn: this.state.newISBN
    }
    axios.post('http://localhost:5000/api/book', bookdata)
    this.fetchAllBooks();
    this.setState({ newTitle: '', newAuthor: '', newISBN: '' })
    this.closeAddModal();
    this.fetchAllBooks();
  }

  updateBook = (event) => {
    event.preventDefault();
    const bookData = {
      title: this.state.editTitle,
      author: this.state.editAuthor,
      isbn: this.state.editISBN,
      id: this.state.editID
    }
    axios.put('http://localhost:5000/api/book', bookData)
    this.closeModal();
    this.setState({ editTitle: '', editAuthor: '', editISBN: '' })
    this.fetchAllBooks();
  }

  deleteBook = async (id) => {
    console.log({id})
    console.log('Delete clicked')
    await axios.delete('http://localhost:5000/api/book/', { data: { id: id } })
    this.fetchAllBooks()
  }

  handleTitleChange = (event) => {
    this.setState({ newTitle: event.target.value });
  };

  handleAuthorChange = (event) => {
    this.setState({ newAuthor: event.target.value });
  };

  handleISBNChange = (event) => {
    this.setState({ newISBN: event.target.value });
  };

  handleEditTitleChange = (event) => {
    this.setState({ editTitle: event.target.value });
  };

  handleEditAuthorChange = (event) => {
    this.setState({ editAuthor: event.target.value });
  };

  handleEditISBNChange = (event) => {
    this.setState({ editISBN: event.target.value });
  };

  render() {
    return (
      <div className="container">
        <Modal 
            visible={this.state.modal}
            width="550"
            height="375"
            effect="fadeInUp"
            onClickAway={() => this.closeModal()}
        >
          <div className="container">
              <h1>Edit Book</h1>
              <form onSubmit={this.updateBook}>
              Title:<br />
              <input class="form-control" type="text" onChange={this.handleEditTitleChange} name="title" value={this.state.editTitle} placeholder="Walt Disney Collection"/>
              <br />
              Author:<br />
              <input type="text" class="form-control" onChange={this.handleEditAuthorChange} name="author" value={this.state.editAuthor} placeholder="Mickey Mouse"/>
              <br/>
              ISBN:<br />
              <input type="text" class="form-control" onChange={this.handleEditISBNChange} name="author" value={this.state.editISBN} placeholder="573058653"/>
              <br/>
              <div>
              <input className="btn btn-info" type="submit" value="Update Book" />
              <button className="btn btn-danger float-right" onClick={() => this.closeModal()}>Close</button>
              </div>
            </form> 
          </div>
        </Modal>


        <Modal 
            visible={this.state.addModal}
            width="550"
            height="375"
            effect="fadeInUp"
            onClickAway={() => this.closeAddModal()}
        >
          <div className="container">
              <h1>Add Book</h1>
              <form onSubmit={this.createBook}>
              Title:<br />
              <input type="text" class="form-control" onChange={this.handleTitleChange} name="title" value={this.state.newTitle} placeholder="Walt Disney Collection"/>
              Author:<br />
              <input type="text" class="form-control" onChange={this.handleAuthorChange} name="author" value={this.state.newAuthor} placeholder="Mickey Mouse"/>
              ISBN:<br />
              <input type="text" class="form-control" onChange={this.handleISBNChange} name="author" value={this.state.newISBN} placeholder="573058653"/>
              <input className="btn btn-success" type="submit" value="Create Book" />
            </form> 
          </div>
        </Modal>



        <div className="panel panel-default">
          <div className="mb-5 panel-heading">
            <h3 className="panel-title">
              Book Catalog &nbsp;
              {localStorage.getItem('jwtToken') &&
                <button className="btn btn-primary float-right" onClick={this.logout}>Logout</button>
              }
              <button onClick={() => this.openAddModal()} className="btn btn-success float-right mr-2">Add Book</button>
            </h3>
          </div>
          <div className="panel-body">
            <table className="table table-stripe">
              <thead>
                <tr>
                  <th>ISBN</th>
                  <th>Title</th>
                  <th>Author</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {this.renderBooksList()}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    );
  }
}

export default App;