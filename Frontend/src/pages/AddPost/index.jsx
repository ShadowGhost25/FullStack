import React from 'react';
import TextField from '@mui/material/TextField';
import Paper from '@mui/material/Paper';
import Button from '@mui/material/Button';
import SimpleMDE from 'react-simplemde-editor';
import axios from "../../axios";

import 'easymde/dist/easymde.min.css';
import styles from './AddPost.module.scss';
import { useDispatch, useSelector } from 'react-redux';
import { selectIsAuth } from '../../redux/slices/auth';
import { Navigate, useNavigate, useParams } from 'react-router-dom';

export const AddPost = () => {
  const {id} = useParams()
  const navigate = useNavigate()
  const inputFileRef = React.useRef(null)
  const isAuth = useSelector(selectIsAuth);
  const isEdditing = Boolean(id)

  const [text, setText] = React.useState('');
  const [inLoading, setLoading] = React.useState(false)
  const [title, setTitle] = React.useState('');
  const [tags, setTags] = React.useState('');
  const [imageUrl, setImageUrl] = React.useState('')


  const handleChangeFile = async (event) => {
    try {
      const formData = new FormData()
      const file = event.target.files[0]
      formData.append('image', file)
      const { data } = await axios.post('/uploads', formData) //отправка картинки на бэк
      setImageUrl(data.url)
    } catch (error) {
      alert('Ошибка при загрузке файла')
    }
  };

  const onClickRemoveImage = () => {
    setImageUrl('')
  };

  const onChange = React.useCallback((value) => {
    setText(value);
  }, []); //useCallback нужен для SimpleMDE библиотеки

  const onSubmit = async () => {
    try {
      
        setLoading(true)
      const fields = {
        title,
        text,
        tags,
        imageUrl,
      }
      console.log(fields)
      
      const { data } = isEdditing 
      ? await axios.patch(`/posts/${id}`, fields) 
      : await axios.post('/posts', fields)

      const _id = isEdditing ? id : data._id;

      navigate(`/posts/${_id}`)
    } catch (error) {
      console.warn(error)
      alert('Ошибка при получении статьи')
    }
  }

  React.useEffect(() =>{
    if(id){
      axios.get(`/posts/${id}`)
      .then(({ data }) => {
        setTitle(data.title)
        setText(data.text)
        setImageUrl(data.imageUrl)
        setTags(data.tags.join(','))
      })
      .catch(err =>{
        condsole.warn(err)
        alert('Ошибка при загрузке статьи')
      }) 
    }
  }, []) 

  const options = React.useMemo(
    () => ({
      spellChecker: false,
      maxHeight: '400px',
      autofocus: true,
      placeholder: 'Введите текст...',
      status: false,
      autosave: {
        enabled: true,
        delay: 1000,
      },
    }),
    [],
  );

  if (!window.localStorage.getItem('token') && !isAuth) {
    return <Navigate to="/" />
  }

  return (
    <Paper style={{ padding: 30 }}>
      <Button onClick={() => inputFileRef.current.click()} variant="outlined" size="large">
        Загрузить превью
      </Button>
      <input
        ref={inputFileRef}
        type="file"
        onChange={handleChangeFile}
        hidden />
      {imageUrl && (
        <>
          <Button variant="contained" color="error" onClick={onClickRemoveImage}>
            Удалить
          </Button>
          <img className={styles.image} src={`http://localhost:4444${imageUrl}`} alt="Uploaded" />
        </>
      )}
      <br />
      <br />
      <TextField
        classes={{ root: styles.title }}
        variant="standard"
        placeholder="Заголовок статьи..."
        value={title}
        onChange={e => setTitle(e.target.value)}
        fullWidth
      />
      <TextField classes={{ root: styles.tags }}
        variant="standard"
        placeholder="Тэги"
        value={tags}
        onChange={e => setTags(e.target.value)}
        fullWidth />
      <SimpleMDE
        className={styles.editor}
        value={text}
        onChange={onChange}
        options={options} />
      <div className={styles.buttons}>
        <Button onClick={onSubmit} size="large" variant="contained">
          {isEdditing ? 'Сохранить' : 'Опубликовать'}
        </Button>
        <a href="/">
          <Button size="large">Отмена</Button>
        </a>
      </div>
    </Paper>
  );
};
>>>>>>> Stashed changes
