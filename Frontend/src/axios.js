import axios from 'axios';

const instance = axios.create({
    baseURL: 'http://localhost:4444'
})

instance.interceptors.request.use((config) => {
config.headers.Authorization = window.localStorage.getItem('token')

return config
}) //если происходит любой запрос проверяй есть ли в storage и кидай в эту информацию

export default instance