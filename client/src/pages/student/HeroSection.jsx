import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const HeroSection = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const navigate = useNavigate();

  const searchHandler = (e) => {
    e.preventDefault();
    if (searchQuery.trim() !== "") {
      navigate(`/course/search?query=${searchQuery}`);
    }
    setSearchQuery("");
  };

  return (
    <section className="relative bg-slate-100 dark:bg-slate-900">
      {/* Gradient Card */}
      <div className="max-w-7xl mx-auto px-6 pt-16 pb-20">
        <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-blue-600 to-indigo-600 dark:from-indigo-700 dark:to-purple-700 p-10 md:p-14 shadow-xl">
          
          {/* Text */}
          <div className="max-w-2xl">
            <h1 className="text-3xl md:text-4xl font-bold text-white leading-tight">
              Find the Best Courses for You
            </h1>

            <p className="mt-3 text-blue-100 text-base md:text-lg">
              Discover, learn, and upskill with expertly crafted courses built
              to help you grow faster.
            </p>
          </div>

          {/* Search */}
          <form
            onSubmit={searchHandler}
            className="mt-8 flex items-center bg-white/95 dark:bg-slate-900 rounded-xl shadow-md overflow-hidden max-w-xl"
          >
            <Input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search courses, skills, topics..."
              className="flex-1 border-none focus-visible:ring-0 px-4 py-3 text-gray-900 dark:text-gray-100 placeholder-gray-400"
            />

            <Button
              type="submit"
              className="rounded-none rounded-r-xl bg-indigo-600 hover:bg-indigo-700 px-6"
            >
              Search
            </Button>
          </form>

          {/* CTA */}
          <div className="mt-6">
            <Button
              variant="secondary"
              onClick={() => navigate(`/course/search?query`)}
              className="rounded-xl bg-white text-indigo-600 hover:bg-gray-100 dark:bg-slate-800 dark:text-white"
            >
              Explore All Courses
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
