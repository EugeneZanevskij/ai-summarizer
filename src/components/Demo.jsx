import { useState, useEffect } from "react";
import {copy, linkIcon, loader, tick} from '../assets';

import { useLazyGetSummaryQuery } from "../services/article";

const Demo = () => {
  const [article, setArticle] = useState({
    url: '',
    summary: '',
  });

  const [allArticles, setAllArticles] = useState([]);
  const [copied, setCopied] = useState('');

  const [getSummary, {error, isFetching}] = useLazyGetSummaryQuery();
  
  useEffect(() => {
    const articlesFromLocalStorage  = JSON.parse(localStorage.getItem('articles'));
    if (articlesFromLocalStorage) {
      setAllArticles(articlesFromLocalStorage);
    }
  }, []);
  const handleSubmit = async (e) => {
    e.preventDefault();

    const { data } = await getSummary({ articleUrl: article.url });
    if (data?.summary) {
      const newArticle = { ...article, summary: data.summary };
      const updatedAllArticles = [newArticle, ...allArticles];

      // update state and local storage
      setArticle(newArticle);
      setAllArticles(updatedAllArticles);
      console.log(updatedAllArticles);

      localStorage.setItem('articles', JSON.stringify(updatedAllArticles));
    }
  };
  
  const handleCopy = (copyUrl) => {
    setCopied(copyUrl);
    navigator.clipboard.writeText(copyUrl);
    setTimeout(() => setCopied(''), 5000);
  }
  return (
    <section className="mt-16 w-full max-w-xl">
      <div className="flex flex-col w-full gap-2">
        <form 
          className="relative flex justify-center items-center"
          onSubmit={handleSubmit}
        >
          <img 
            src={linkIcon} 
            alt="linkIcon" 
            className="absolute left-0 my-2 ml-3 w-6 h-6"
          />
          <input 
            type="url" 
            placeholder="Enter URL"
            value={article.url}
            onChange={(e) => {setArticle({...article, url: e.target.value})}}
            required
            className="url_input peer"
          />
          <button 
            type="submit" 
            className="submit_btn"
            peer-focus:border-gray-700
            peer-focus:text-gray-700
          >
            Enter
          </button>
        </form>
        {/* Browse URL History */}
        <div className="flex flex-col gap-1 max-h-60 overflow-y-auto">
          {allArticles.map((article, index) => (
            <div 
              key={`link-${index}`}
              onClick={() => setArticle(article)}
              className="link_card"
            >
              <div 
                className="copy_btn"
                onClick={() => {
                  setCopied(article.url);
                }}
              >
                <img src={copied === article.url ? tick : copy} alt="copy" className="w-[40%] h-[40%] object-contain"/>
              </div>
              <p className="flex-1 font-satoshi text-blue-700 font-medium text-sm">{article.url}</p>
            </div>
          ))}
        </div>
      </div>
      {/* Display results */}
      {isFetching ? (
        <img src={loader} alt="loader" className="w-20 h-20 object-contain" />
        ) : error ? (
        <p className="font-inter text-red-700 text-center font-bold">
          Error occurred <br/>
          <span className="font-normal">{error?.data?.message}</span>
        </p>
      ) : (
        article.summary && (
          <div className="flex flex-col gap-4 mt-6">
            <h2 className="font-inter font-bold text-blue-950 text-2xl">
              Article <span className="blue_gradient">Summary</span>
            </h2>
            <div className="summary_box">
              <p className="font-medium text-sm">{article.summary}</p>
            </div>
          </div>
        )
      )}
    </section>
  )
}

export default Demo