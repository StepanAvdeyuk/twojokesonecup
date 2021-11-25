import { useState, useEffect } from 'react';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import axios from 'axios';


const AddJokeAdmin = ({token}) => { 
    const [status, setStatus] = useState('default');
    

    useEffect(() => {
        if (status == 'Анекдот успешно отправлен' || status == 'Произошла ошибка при отправке') {
                const refreshAddJoke = setTimeout(function() {
                  setStatus('default')
                }, 1500)
                return () => {
                        clearInterval(refreshAddJoke);
                }
        }
    }, [status])

    return (
        <Formik 
        initialValues={{ title: '', content: '', author: '', likes: 0, level: 1, show: true}}
        validate={values => {
            const errors = {};
            if (!values.author) {
              errors.author = 'Обязательное поле';
            }
            if (!values.title) {
                errors.title = 'Обязательное поле';
            }
            if (!values.level || values.level > 10 || values.level < 1) {
                errors.level = '*';
            }
            if (!values.content) {
                errors.content = 'Обязательноe поле';
            }
            if (!values.likes && values.likes !== 0) {
                errors.likes = '*';
            }     
            return errors;
          }}
        onSubmit = {(values) => {
            axios({
                method: 'POST',
                url: 'http://89.108.76.196:8000/admin/create', 
                headers: {
                    'Authorization': 'Bearer ' + token,
                    'accept': 'application/json',
                    'Content-Type': 'application/json'
                },
                data: {
                    title: values.title,
                    content: values.content, 
                    author: values.author,
                    likes: values.likes,
                    level: values.level,
                    show: values.show
                }
            })
              .then((e) => { if (e.status == 201) {setStatus('Анекдот успешно отправлен')}})
              .catch(setStatus('Произошла ошибка при отправке'))
              .finally(
                  values.author = "",
                  values.title = "",
                  values.level = 1, 
                  values.likes = 0,
                  values.content = '',
                  values.show = true
              )
        }}
        >
            <Form className="admin__add-wrapper">
                <Field type="text" name="author" className="admin__add-input" placeholder="Автор"/>
                <ErrorMessage name="author" component="div" className="admin__add-error"/>

                <Field type="text" name="title" className="admin__add-input" placeholder="Название анекдота"/>
                <ErrorMessage name="title" component="div" className="admin__add-error"/>

                <div className="admin__add-nums">
                    <Field type="number" name="level" className="admin__add-numinput" placeholder="Уровень"/>
                    <ErrorMessage name="level" component="div" className="admin__add-error"/>
                    <label htmlFor="level" className="admin__add-numinput-label">Уровень анекдота</label>

                    <Field type="number" name="likes" className="admin__add-numinput" placeholder="Кол-во лайков"/>
                    <ErrorMessage name="likes" component="div" className="admin__add-error"/>
                    <label htmlFor="likes" className="admin__add-numinput-label">Количество лайков</label>
                </div>

                <Field as="textarea" name="content" type="text" className="admin__add-joke" placeholder="Анекдот"/>
                <ErrorMessage name="content" component="div" className="admin__add-error"/>


                <div className="admin__add-checkbox">
                    <label htmlFor="show" className="admin__add-checkboxlabel">Сразу отобразить на главной</label>
                    <Field type="checkbox" name="show"></Field>
                </div>

                <button type="submit" className="admin__add-btn">Добавить</button>
                {(status !== 'default') ? <div className="admin__add-status">{status}</div> : null}
            </Form>
        </Formik>
    )
}

export default AddJokeAdmin;