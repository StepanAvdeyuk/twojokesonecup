import { Formik, Form, Field, ErrorMessage, useField } from 'formik';
import { useState, useEffect, useCallback } from 'react';
import axios from 'axios';

const JokeRequestList = ({token}) => {

    const [requests, setRequests] = useState([]);
    const [zeroRequests, setZeroRequests] = useState(false);

    const [onDelete, setOnDelete] = useState(null);
    const [onUpdate, setOnUpdate] = useState(null);

    useEffect(() => {
        getAllRequests();
    }, []);

    useEffect(() => {
        if(onDelete) {
            setOnDelete(false);
            getAllRequests();
        }
    }, [onDelete]);

    useEffect(() => {
        if(onUpdate) {
            setOnDelete(false);
            getAllRequests();
        }
    }, [onUpdate]);


    const onRequestsLoaded = (newRequests) => {
        if (newRequests.length == 0) {setZeroRequests(true)}
        setRequests(newRequests.data);
    }

    const getAllRequests = () => {
        const config = {
            headers: {
                Authorization: 'Bearer ' + token
            }
        }
        axios.get('http://89.108.76.196:8000/admin/?offset=0&limit=-1&order=published_at&desc=true', config)
              .then(onRequestsLoaded)
              .catch(e => {throw e})
    }

    const MyInput = ({...props}) => {
        const [field, meta] = useField(props);
        
        const style = meta.touched && meta.error ?  {border: '1px solid #FF2800'} : null;

        return (
          <>
            <input {...field} {...props} style={style}/>
          </>
        );
    };

    const MyTextareaInput = ({...props}) => {
        const [field, meta] = useField(props);
        
        const style = meta.touched && meta.error ?  {border: '1px solid #FF2800'} : null;

        return (
          <>
            <textarea {...field} {...props} style={style}/>
          </>
        );
    };

    const onJokeDeleted = (e) => {
        setOnDelete(true);
    }

    const jokeDelete = useCallback((id) => {
        const config = {
            headers: {
                Authorization: 'Bearer ' + token
            }
        }
        axios.delete(`http://89.108.76.196:8000/anecdotes/${id}`, config)
              .then(onJokeDeleted)
              .catch(error => {throw error})
    })

    const onShowJoke = (e) => {
        setOnUpdate(true);
    }

    const showJoke = useCallback((id, values) => {
        axios({
            method: 'PUT',
            url: `http://89.108.76.196:8000/anecdotes/${id}`,
            headers: {
                Authorization: 'Bearer ' + token
            },
            data: {
                title: values.title,
                content: values.content, 
                author: values.author,
                likes: values.likes,
                level: values.level,
                show: true
            }})
              .then(onShowJoke)
              .catch(error => {throw error})
    })

    function renderItems(requests) {
        const items = requests.map((item) => {
                if (!item.show) {
                    return ( 
                        <Formik
                        key={item.id}
                        initialValues={{ author: item.author, title: item.title , level: "", likes: "", content: item.content}}
                        validate={values => {
                            const errors = {};
                            if (!values.author) {
                              errors.author = '*';
                            }
                            if (!values.title) {
                                errors.title = '*';
                            }
                            if (!values.level || values.level > 10 || values.level < 1) {
                                errors.level = '*';
                            }
                            if (!values.content) {
                                errors.content = '*';
                            }
                            if (!values.likes && values.likes !== 0) {
                                errors.likes = '*';
                            }     
                            return errors;
                          }}
                        onSubmit={values => showJoke(item.id, values)}
                          >
                            <Form className="request__item">
                                <MyInput name="author" type="text" className="request__joke-author" placeholder="Автор"/>

                                <MyInput name="title" type="text" className="request__joke-name" placeholder="Название анекдота"/>       
   
                                <MyInput name="level" type="number" className="request__joke-level" placeholder="Уровень"/>  
    
                                <MyInput name="likes" type="number" className="request__joke-likes" placeholder="Лайки"/>     

                                <MyTextareaInput name="content" type="text" className="request__joke" placeholder="Анекдот"/>   

                                <button type="submit" className="request__add-btn">Добавить</button>
                                <button className="request__add-btn request__add-btn-red" type="button" onClick={() => jokeDelete(item.id)}>Удалить</button>
                            </Form>
                        </Formik>
                    )
                }
        })

 
        return (
            <div className="request__wrapper">
                {items}
            </div>
        )
    }
 
    return( 
        <div className="request">
            {renderItems(requests)}
        </div>
    )
}

export default JokeRequestList;