import React, { useEffect, useState } from 'react';
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogClose,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import DoubleEndedSlider from '@/components/imported/doubleEndedSlider';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Separator } from '@/components/ui/separator';
// Accepts props for available types, min/max price, current filter, and callbacks
export default function SearchFilterDialog({
  trigger,
  minPrice = 0,
  maxPrice = 1000,
  categories = [],
  value,
  onChange,
  onClear,
}: {
  trigger: React.ReactNode;
  minPrice?: number;
  maxPrice?: number;
  categories: string[];
  value: { min: number; max: number; categories: string[], sortBy: string, sortOrder: string, discount: boolean };
  onChange: (v: { min: number; max: number; categories: string[], sortBy: string, sortOrder: string, discount: boolean }) => void;
  onClear: () => void;
}) {
  const [filters, setFilters] = useState(value);

  // Keep local state in sync with parent value
  useEffect(() => {
    setFilters(value);
  }, [value]);

  const handleCategoryToggle = (category: string) => {
    setFilters((prev) => ({
      ...prev,
      categories: prev.categories.includes(category)
        ? prev.categories.filter((t) => t !== category)
        : [...prev.categories, category],
    }));
  };

  const handleSlider = (which: 'min' | 'max', value: number) => {
    setFilters((prev) => {
      const next = { ...prev };
      next[which] = value;
      if (next.min > next.max) {
        next.max = next.min;
      }
      return next;
    });
  };

  const handleInput = (which: 'min' | 'max', v: string) => {
    const num = Number(v.replace(/[^\d.]/g, ''));
    if (!isNaN(num))
      handleSlider(which, num);
  };

  const handleSortBy = (sortBy: string) => {
    if (sortBy === 'discounted')
      setFilters((prev) => ({ ...prev, discount: true }));
    else {
      const order = sortBy.startsWith('-') ? 'desc' : 'asc';
      setFilters((prev) => ({ ...prev, sortBy: sortBy.replace('-', ''), sortOrder: order }));
    }
  };

  const handleApply = () => {
    onChange(filters);
  };

  const handleClear = () => {
    setFilters({
      min: minPrice,
      max: maxPrice,
      categories: [],
      sortBy: 'price',
      sortOrder: 'desc',
      discount: false,
    });
    onClear();
  };

  return (
    <Dialog>
        <DialogTrigger asChild>
            {trigger}
        </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Filter Products</DialogTitle>
        </DialogHeader>
        <Separator />
        <div className="flex flex-col gap-6">
          <div>
            <label className="block mb-6 font-medium text-muted-foreground">Price Range</label>
            <div className="flex items-center gap-2">
              <DoubleEndedSlider
                min={minPrice}
                max={maxPrice}
                step={1}
                value={[filters.min, filters.max] as [number, number]}
                onValueChange={(vals: number[]) => {
                  const [min, max] = vals as [number, number];
                  setFilters((prev) => ({ ...prev, min, max }));
                }}
                className="w-full mb-3"
              />
            </div>
            <div className="flex gap-2 mt-2">
              <Input
                type="number"
                min={minPrice}
                max={filters.max}
                value={filters.min}
                onChange={(e) => handleInput('min', e.target.value)}
                className="w-1/2"
                placeholder="Min"
              />
              <Input
                type="number"
                min={filters.min}
                max={maxPrice}
                value={filters.max}
                onChange={(e) => handleInput('max', e.target.value)}
                className="w-1/2"
                placeholder="Max"
              />
            </div>
          </div>

          <div>
            <label className="block mb-4 font-medium text-muted-foreground">Sort By</label>
            <Select onValueChange={handleSortBy}>
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Select a sort order" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="price">Price Ascending</SelectItem>
                <SelectItem value="-price">Price Descending</SelectItem>
                <SelectItem value="discounted">Discounted Only</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div>
            <label className="block mb-4 font-medium text-muted-foreground">Product Categories</label>
            <div className="flex flex-wrap gap-2">
              {categories.map((category) => (
                <button
                  key={category}
                  type="button"
                  onClick={() => handleCategoryToggle(category)}
                  className={`px-3 py-1 rounded-full border text-xs font-medium transition-colors hover:cursor-pointer capitalize ${
                    filters.categories.includes(category)
                      ? 'bg-primary text-primary-foreground border-primary'
                      : 'bg-muted text-muted-foreground border-muted'
                  }`}
                >
                  {category.split('-').join(' ')}
                </button>
              ))}
            </div>
          </div>
        </div>
        <Separator />
        <DialogFooter>
          <Button variant="outline" type="button" onClick={handleClear}>
            Clear
          </Button>
          <DialogClose asChild>
            <Button type="button" onClick={handleApply}>
              Save & Apply
            </Button>
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
