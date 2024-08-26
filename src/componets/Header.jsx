import  { useEffect, useState } from 'react';
import './Header.css';
import YouTube from 'react-youtube';
import axios from '../axios';
import requests from '../request';


function Header() {
  const [movie, setMovie] = useState([]);
  const[movieTrailer,setMovieTrailer]=useState("")
  const opts = {
    height: "300",
    width: "100%",
  }
 
  useEffect(() => {  
    async function fetchData() {
        const request = await axios.get(requests.fetchNetflixOriginals);
        setMovie(request.data.results[Math.floor(Math.random() * request.data.results.length - 1)]);
        return request;   
    } fetchData();
  }, []) 

  // fact movies traler 

  async function trailer(id) {
    try {
        const response = await fetch(`https://api.themoviedb.org/3/movie/${id}/videos?api_key=ab1da08307f82007e9975d4dccf67670`);

        // Check if the response is ok (status code 200-299)
        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }

        const data = await response.json();
        
        // Check if results array is present and has at least one item
        if (data.results && data.results.length > 0) {
            const trailerKey = data.results[0].key;
            setMovieTrailer(trailerKey);
        } else {
            console.log("No trailers found");
            // Handle the case where no trailers are available
        }
    } catch (error) {
        console.error("Error fetching trailer:", error);
        // Handle the error, e.g., display a message to the user
    }
}
  
    return (
      <div>
       <header className="banner"
       style={{
           backgroundSize: "cover",
           backgroundImage: `url("https://image.tmdb.org/t/p/original/${movie?.backdrop_path}")`,
           backgroundPosition: "center-center",
       }}
       >

           <div className="banner__contents">
               <h1 className="banner__title">
                   {movie?.title || movie?.name || movie?.original_name}
               </h1>
               <div className="banner__buttons">

                   <button  className="banner__button"> Play</button>
                   <button className="Movie_button"  onClick={()=>trailer(movie?.id)}>Play Trailer</button>
                   <button className="banner__button">My List</button>
               </div>
              <h1 className="banner__description">
                  {(movie?.overview)}
              </h1>
           </div>
         
            <div>
            {movieTrailer && <YouTube videoId={movieTrailer} opts={opts}  />}
        </div>   
         
       </header>
      </div>
    )
}

export default Header