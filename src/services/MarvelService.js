import {useHttp} from '../hooks/http.hook';


const useMarvelService = () => {
    const {loading, request, error} = useHttp();

    const _baseOffset = 0;
    const _apiBase = 'http://89.108.76.196:8000/anecdotes/';


    const getAllJokes = async (offset = _baseOffset, limit = 1) => {
        const res = await request(`${_apiBase}?offset=${offset}&limit=${limit}&order=published_at&desc=true`);
        return res;
    }

    const getSearchJokes = async (search, offset = _baseOffset, limit = 1) => {
        const res = await request(`${_apiBase}?offset=${offset}&limit=${limit}&order=published_at&desc=true&search=${search}`);
        return res;
    }

    return {loading, error, getAllJokes, getSearchJokes}
}

export default useMarvelService;