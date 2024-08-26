import { Link, useLocation } from "react-router-dom"
import YouTube from 'react-youtube';
import './Movie.css'
import { useState } from "react";


const Movie = () => {    
  const[movieTrailer,setMovieTrailer]=useState("")
  const [movieCast,setMovieCast]=useState([]);
    const location = useLocation();
    const specificMovie = location.state.movie;
    const baseUrl = "https://image.tmdb.org/t/p/original/"
    const opts = {
      height: "390",
      width: "100%",
    }

    // async function trailer (id){
    //    fetch(`http://api.themoviedb.org/3/movie/${id}/videos?api_key=ab1da08307f82007e9975d4dccf67670`)
    //    .then(res=>res.json())
    //    .then(d=>setMovieTrailer(d.results[0].key))
    // }

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
  

    async function movieCasts(id){
      fetch(`https://api.themoviedb.org/3/movie/${id}/credits?api_key=ab1da08307f82007e9975d4dccf67670&language=en-US`)
      .then(res=>res.json()).then(d=>setMovieCast(d.cast))

      console.log(movieCast)
    }
  return (
    <section>
      <div className="Movie_page" style={{
        background:`url("https://image.tmdb.org/t/p/original/${specificMovie.poster_path}")`,
        backgroundSize:'cover',
        height:'100vh'
    }}>
     <img className="Movie_image"  src={`https://image.tmdb.org/t/p/original/${specificMovie.poster_path}`}></img>
      <div className="Movie_content">
      <h1 className="Movie_title" >{specificMovie.name || specificMovie.title}</h1>
      <p>{specificMovie.overview}</p>
      <p>{specificMovie.vote_average}/10⭐</p>
      <button className="Movie_button"  onClick={()=>trailer(specificMovie.id)}>Play Trailer</button>
      <button className="Movie_button" onClick={()=>movieCasts(specificMovie.id)}>Cast</button>
      </div>
    </div>
    <div className="castimgblock">
        {
          movieCast.slice(0,10).map((x)=>{
            return(
              <div key={x.cast_id}>
              <Link to={`/cast/${x.cast_id}/${x.original_name}`}>
              <img src={`${baseUrl}${x.profile_path}`} style={{width:"100px", height:"100px"}} />
              </Link>
              <p style={{color:'white'}}>{x.name}</p>
              </div>
            )
          })
        }
      </div>
    <div>
        {movieTrailer && <YouTube videoId={movieTrailer} opts={opts}  />}
      </div>   
    </section>

  )
}

export default Movie
