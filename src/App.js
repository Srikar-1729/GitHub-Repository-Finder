import React,{useState} from "react";
import './App.css';
import axios from "axios";
import { FaStar, FaCodeBranch, FaExclamationCircle, FaCircle } from "react-icons/fa";
import colors from "./colors.json";



function App() {
  
const config = {
  headers: {
    'Accept': 'application/vnd.github+json',
    'Authorization': process.env.REACT_APP_API_TOKEN, 
    'X-GitHub-Api-Version': '2022-11-28' 
  }
};
  const [data, setData] = useState(null);
  const [message,setMessage] = useState("Please select a language");

  function handleChange(event){
    setData(null);
    setMessage("Loading, please wait..");
    // console.log(event.target);
    if(event.target.value!=="refresh")
    var lang = event.target.value;
    else
    var lang = data[0];
    axios.get(`https://api.github.com/search/repositories?q=language:${lang}&per_page=100`,config).then(function (response) {
      var x = Math.floor(Math.random()*100);
      var repo = response.data.items[x];
      var y = colors.filter((l)=>{return (l.language===lang)})[0].color;
      console.log(y);
      var info = [lang,repo.name,repo.description,repo.stargazers_count,repo.forks_count,repo.open_issues_count,y];
      setData(info);
    })
    .catch(error => {
      setMessage("Error fetching repositories")
      console.log(error.response.data); 
      console.error(error.response.status);  
      console.error(error.response.headers); 
    })
  }

  return (
    <div className="App">
     <div class="container">
        <div class="top">
          <div className="box"></div>
          <p  className="head">GitHub Repository Finder</p>
        </div>
        <select className="dropdown"  onChange={handleChange}>
          <option hidden>Select a Language</option>
          {colors.map((x)=>{
            return (<option value={x.language}>{x.language}</option>)
          })}
        </select>
        
          {(data===null)?
         
            (message=="Error fetching repositories")?
            <div>
              <div className="error">
                <p>{message}</p>
              </div>
              <button className="errbtn" onClick={handleChange} value="refresh">Click to retry</button> 
             </div>: 
            <div className="initial"><p>{message}</p></div>
            
          
          :
          <div>
            <div className="content">
                <h4 style={{"fontWeight":"500","textAlign":"left","margin":"5% 0"}}>{data[1]}</h4>
                <p className="desc">{data[2]}</p>
                <pre className="features"><FaCircle style={{"color":data[6]}}/> {data[0]}   <FaStar /> {data[3]}   <FaCodeBranch /> {data[4]}   <FaExclamationCircle /> {data[5]}</pre>
            </div>
            <button className="refresh" onClick={handleChange} value="refresh">Refresh</button>
          </div>
          }

        </div>
    </div>
  );
}

export default App;
