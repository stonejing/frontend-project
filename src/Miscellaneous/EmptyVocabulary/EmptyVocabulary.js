import React, { useState, useEffect } from 'react';
import axios from 'axios';

const mockData = [
  {
    vo: "tt1",
    ex: "this is a test1",
  },
  {
    vo: "tt2",
    ex: "this is a test2",
  },
  {
    vo: "tt3",
    ex: "this is a test3",
  }
];

export default function EmptyVocabulary()
{
  const [visib, setVisib] = useState('hidden')
  const [count, setCount] = useState(0);
  const [reqData, setReqData] = useState('null');
  const [word, setWord] = useState('');
  const [tag, setTag] = useState('');

  // mockData.map((item) => {
  //   console.log(item.vo, item.ex);
  //   return null;
  // })

  const reset = () => {
    setVisib('visible')
  }

  const hide = () => {
    setVisib('hidden')
  }

  const next = () => {
    if(count < mockData.length - 1)
    {
      setCount(count + 1);
      setVisib('hidden');
    }
  }

  const prev = () => {
    if(count > 0)
    {
      setCount(count - 1);
      setVisib('hidden');
    }
  }

  let postData = new FormData();
  postData.append("username", "test");
  postData.append("password", "test");

  const showRequestData = () => {
    axios.post('http://127.0.0.1:5000/api/add_user', postData, {
      auth: {
        username: 'stonejing',
        password: 'stonejing'
      }
    }).then((res) => {
      console.log(res.data);
      setReqData(res.data);
    }).catch((err) => {
      console.log(err);
    })
  }

  const handleWordChange = e => {
    setWord(e.target.value);
  }

  const handleTagChange = e => {
    setTag(e.target.value);
  }

  const handleSubmit = (e) => {
    console.log(word);
    console.log(tag);
    e.preventDefault();
    let wordData = new FormData();
    wordData.append("vocabulary", word);
    wordData.append("tag", tag);
    axios.post('http://127.0.0.1:5000/api/add_vocabulary', wordData, {
      auth: {
        username: 'stonejing',
        password: 'stonejing'
      }
    }).then((res) => {
      console.log(res.data);
      // setReqData(res.data.message);
    }).catch((err) => {
      // console.log(err);
    })
  }

  useEffect(() => {
    
  }, [])

  return (
    <div>
      <div>
        { mockData[count].vo }
      </div>
      <div style={{visibility: visib}}>
        { mockData[count].ex }
      </div>
      <div>
        { reqData }
      </div>

      <div>
        <button onClick={hide}>
          hide
        </button>
        <button onClick={reset}>
          reset
        </button>
        <button onClick={prev}>
          prev
        </button>
        <button onClick={next}>
          next
        </button>
        <button onClick={showRequestData}>
          show
        </button>
      </div>
      <div>
        <form onSubmit={handleSubmit}>
          <div>
            <label>
              vocabulary:
              <input type="text" value={word} onChange={handleWordChange} />
            </label>
          </div>
          <div>
            <label>
              tag:
              <input type="text" value={tag} onChange={handleTagChange} />
            </label>       
          </div>
          <div>
            <input type="submit" value="Submit" />
          </div>
        </form>
      </div>
    </div>
  )
}