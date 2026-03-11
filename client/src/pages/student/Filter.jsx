import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { Card, CardContent } from "@/components/ui/card";
import React, { useState } from "react";

const categories = [
  { id: "nextjs", label: "Next JS" },
  { id: "data science", label: "Data Science" },
  { id: "frontend development", label: "Frontend Development" },
  { id: "fullstack development", label: "Fullstack Development" },
  { id: "mern stack development", label: "MERN Stack Development" },
  { id: "backend development", label: "Backend Development" },
  { id: "javascript", label: "Javascript" },
  { id: "python", label: "Python" },
  { id: "docker", label: "Docker" },
  { id: "mongodb", label: "MongoDB" },
  { id: "html", label: "HTML" },
];

const Filter = ({ handleFilterChange }) => {
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [sortByPrice, setSortByPrice] = useState("");

  const handleCategoryChange = (categoryId) => {
    setSelectedCategories((prev) => {
      const updated = prev.includes(categoryId)
        ? prev.filter((id) => id !== categoryId)
        : [...prev, categoryId];

      handleFilterChange(updated, sortByPrice);
      return updated;
    });
  };

  const selectByPriceHandler = (value) => {
    setSortByPrice(value);
    handleFilterChange(selectedCategories, value);
  };

  return (
    <Card className="sticky top-24">
      <CardContent className="p-4 space-y-4">
        {/* HEADER */}
        <div>
          <h2 className="text-lg font-semibold">Filters</h2>
          <p className="text-sm text-gray-600 dark:text-gray-400">
            Refine your search
          </p>
        </div>

        {/* SORT */}
        <div className="space-y-2">
          <Label className="text-sm font-medium">
            Sort by Price
          </Label>
          <Select onValueChange={selectByPriceHandler}>
            <SelectTrigger>
              <SelectValue placeholder="Select order" />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                <SelectLabel>Price</SelectLabel>
                <SelectItem value="low">
                  Low to High
                </SelectItem>
                <SelectItem value="high">
                  High to Low
                </SelectItem>
              </SelectGroup>
            </SelectContent>
          </Select>
        </div>

        <Separator />

        {/* CATEGORIES */}
        <div className="space-y-3">
          <Label className="text-sm font-medium">
            Categories
          </Label>

          <div className="space-y-2 max-h-[300px] overflow-y-auto pr-1">
            {categories.map((category) => (
              <div
                key={category.id}
                className="flex items-center gap-2"
              >
                <Checkbox
                  id={category.id}
                  onCheckedChange={() =>
                    handleCategoryChange(category.id)
                  }
                />
                <Label
                  htmlFor={category.id}
                  className="text-sm cursor-pointer"
                >
                  {category.label}
                </Label>
              </div>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default Filter;
