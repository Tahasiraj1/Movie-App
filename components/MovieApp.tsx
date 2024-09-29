"use client";
import Image from 'next/image';
import { useState, useEffect, ChangeEvent } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { CalendarIcon, CircleChevronLeftIcon, StarIcon } from 'lucide-react';
import ClipLoader from "react-spinners/ClipLoader";
import { Search } from 'lucide-react';
import { CircleChevronRight } from 'lucide-react';
import { PiFilmSlateFill } from "react-icons/pi";

type MovieDetails = {
    Title: string;
    Year: string;
    Plot: string;
    Poster: string;
    imdbRating: string;
    Genre: string;
    Director: string;
    Actors: string;
    Runtime: string;
    Released: string;
};

type PopularMovie = {
    id: number;
    title: string;
    poster_path: string;
    release_date: string;
    vote_average: number;
};

export default function MovieApp() {
    const [searchTerm, setSearchTerm] = useState<string>("");
    const [movieDetails, setMovieDetails] = useState<MovieDetails | null>(null);
    const [popularMovies, setPopularMovies] = useState<PopularMovie[]>([]);
    const [loading, setLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);
    const [currentPage, setCurrentPage] = useState<number>(1);
    // Fetch popular movies on component mount
    useEffect(() => {
        const fetchPopularMovies = async (): Promise<void> => {
            try {
                const response = await fetch(
                    `https://api.themoviedb.org/3/movie/popular?api_key=${process.env.NEXT_PUBLIC_TMDB_API_KEY}&language=en-US&page=${currentPage}`
                );
                const data = await response.json();
                setPopularMovies(data.results);
            } catch (error: unknown) {
                if (error instanceof Error) {
                    setError(error.message);
                }
            }
        };
        fetchPopularMovies();
    }, [currentPage]);

    const handleNextPage = (): void => {
        setCurrentPage((prevPage) => prevPage + 1);
    };

    const handlePreviousPage = (): void => {
        setCurrentPage((prevPage) => prevPage - 1);
    };

    const handleSearch = async (searchTerm: string): Promise<void> => {
        setLoading(true);
        setError(null);
        setMovieDetails(null);
        try {
            const response = await fetch(
                `https://www.omdbapi.com/?t=${searchTerm}&apikey=${process.env.NEXT_PUBLIC_OMDB_API_KEY}`
            );
            if (!response.ok) {
                throw new Error("Network response was not ok.");
            }
            const data = await response.json();
            if (data.Response === "False") {
                throw new Error(data.error);
            }
            setMovieDetails(data);
        } catch (error: unknown) {
            if (error instanceof Error) {
                setError(error.message);
            }
        } finally {
        setLoading(false);
        }
    };

    const handleChange = (e: ChangeEvent<HTMLInputElement>): void => {
        setSearchTerm(e.target.value);
    };

    const handleMovieClick = (title: string) => {
        setSearchTerm(title);
        handleSearch(title);
        window.scrollTo({ top: 0, behavior: 'smooth' })
    }

    return (
        <div className='flex flex-col items-center justify-center min-h-screen p-8 md:p-10'
        style={{
            backgroundImage: `url('/movie.jpg')`,
            backgroundPosition: 'center',
            backgroundSize: 'cover',
            backgroundAttachment: 'fixed'
        }}
        >
            <header className='absolute top-0 w-full p-6 bg-red-900 text-left text-gray-50 rounded-sm'
            style={{
                backgroundImage: `url('/moviesapp2.jpg')`,
                backgroundPosition: 'center',
                backgroundSize: 'cover',
            }}
            >
                <div className='flex flex-row justify-between relative items-center w-full'>
                    <div className='flex flex-row justify-between items-center'>
                    <h1 className='text-3xl font-bold mr-1'>MoviesHub</h1>
                    <PiFilmSlateFill size={50} />
                    </div>
                    <div className='flex justify-end items-center space-x-2'>
                    <Input
                    type='text'
                    placeholder='Enter movie name.'
                    value={searchTerm}
                    onChange={handleChange}
                    className='min-w-90 md:w-60 text-black text-xs py-2 ml-4 border rounded-3xl focus:outline-none focus:ring-2 focus:ring-blue-500 shadow-2xl'
                    />
                    <Button
                    onClick={() => handleSearch(searchTerm)}
                    className='absolute right-0 size-12 bg-transparent hover:bg-transparent text-black rounded-3xl active:scale-95 transition-transform transform duration:300 shadow-2xl'
                    >
                        <Search className='active:scale-75 transition-transform transform duration:300' />
                    </Button>
                    </div>
                </div>
            </header>
            <main className='pt-10 mt-16'>
                <div className='mb-8 h-auto m-auto max-w-lg bg-gradient-to-b from-red-400 via-red-200 to-white md:bg-gradient-to-r rounded-2xl'>
                {loading && (
                    <div className='flex justify-center items-center'>
                        <ClipLoader size={60} />
                    </div>
                )}
                {error && (
                    <div className='text-red-500 text-center mb-4'>
                        {error}, Please try searching for another movie.
                    </div>
                )}
                {movieDetails && (
                    <div className='flex flex-col md:flex-row items-center'>
                        <div className='w-full mb-4'>
                            <Image
                            src={
                                movieDetails.Poster !== "N/A"
                                ? movieDetails.Poster
                                : '/placeholder.svg'
                            }
                            alt={movieDetails.Title}
                            width={200}
                            height={400}
                            className='rounded-2xl shadow-md my-4 mx-auto hover:scale-105 transition-transform transform duration-300'
                            />
                            <h2 className='text-center text-3xl font-bold mb-2 animate-pulse'>{movieDetails.Title}</h2>
                        </div>
                        <div className='w-full text-center'>
                            <p className='text-gray-600 mb-4 italic mr-5 mt-5'>{movieDetails.Plot}</p>
                            <div className='flex justify-center items-center text-gray-500 mb-2'>
                                <CalendarIcon className='w-4 h-4 mr-1' />
                                <span className='mr-4'>{movieDetails.Year}</span>
                                <StarIcon className='w-4 h-4 mr-1 fill-yellow-500' />
                                <span>{movieDetails.imdbRating}</span>
                            </div>
                            <div className='flex justify-center items-center text-gray-500 mb-2'>
                                <span className='mr-4'>
                                    <strong>Genre:</strong> {movieDetails.Genre}
                                </span>
                            </div>
                            <div className='flex justify-center items-center text-gray-500 mb-2'>
                                <span className='mr-4'>
                                    <strong>Director:</strong> {movieDetails.Director}
                                </span>
                            </div>
                            <div className='flex justify-center items-center text-gray-500 mb-2'>
                                <span className='mr-4'>
                                    <strong>Actors:</strong> {movieDetails.Actors}
                                </span>
                            </div>
                            <div className='flex justify-center items-center text-gray-500 mb-2'>
                                <span className='mr-4'>
                                    <strong>Runtime:</strong> {movieDetails.Runtime}
                                </span>
                            </div>
                            <div className='flex justify-center items-center text-gray-500 mb-4'>
                                <span className='mr-4'>
                                    <strong>Released:</strong> {movieDetails.Released}
                                </span>
                            </div>
                        </div>
                    </div>
                )}
                </div>
                {/* Popular movies */}
                <div className='flex justify-center items-center w-full h-24 bg-red-900 rounded-full mb-10'
                style={{
                    backgroundImage: `url('/moviesapp2.jpg')`,
                    backgroundPosition: 'center',
                    backgroundSize: 'cover'
                }}
                >
                <h2 className='text-white text-4xl font-bold text-center p-5'>Popular Movies</h2>
                </div>
                <div className='grid md:grid-cols-4 gap-4 sm:gap-6 md:gap-8 mb-6 sm:grid-cols-2 xs:grid-cols-1'>
                    {popularMovies.map(movie => (
                        <div key={movie.id}
                        className='animate-in slide-in-from-right-full active:scale-95 bg-gradient-to-b from-red-500 via-red-300 to-white p-4 rounded-2xl shadow-md transition-transform transform duration-300 hover:scale-105'
                        onClick={() => handleMovieClick(movie.title)}
                        >
                            <Image
                            src={`https://image.tmdb.org/t/p/w200${movie.poster_path}`}
                            alt={movie.title}
                            width={200}
                            height={300}
                            loading='lazy'
                            className='rounded-2xl shadow-lg mx-auto hover:scale-105 transition-transform transform duration-300'
                            />
                            <h3 className='text-center mt-2 font-bold'>{movie.title}</h3>
                            <div className='flex items-baseline mt-2'>
                            <CalendarIcon className='w-4 h-4 mr-2' />
                            <span>{movie.release_date}</span>
                            </div>
                            <div className='flex items-baseline mt-1'>
                            <StarIcon className='w-4 h-4 mr-2 fill-yellow-500' />
                            <span>{movie.vote_average}</span>
                            </div>
                        </div>
                    ))}
                </div>
                <div className='flex flex-row justify-center items-center space-x-44'>
                        <Button
                        className= 'text-white hover:bg-transparent hover:text-gray-400'
                        variant='ghost'
                        size='icon'
                        onClick={handlePreviousPage}
                        disabled={currentPage === 1}
                        >
                            <CircleChevronLeftIcon className='active:scale-75 transition-transform transform duration:300' size={50} />
                        </Button>
                        <Button
                        className= 'text-white hover:bg-transparent hover:text-gray-400'
                        variant='ghost'
                        size='icon'
                        onClick={handleNextPage}
                        >
                            <CircleChevronRight className='active:scale-75 transition-transform transform duration:300' size={50} />
                        </Button>
                    </div>
            </main>
        </div>
    );
}