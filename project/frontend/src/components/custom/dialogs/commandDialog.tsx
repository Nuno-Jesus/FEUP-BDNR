import {
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from '@/components/ui/command';
import { useEffect, useState } from 'react';
import { COMPONENTS } from '@/utils/macros';

interface SearchCommandDialogProps {
    entries: typeof COMPONENTS;
}

export function SearchCommandDialog({
    entries,
}: SearchCommandDialogProps) {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === 'k' && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        setOpen((open) => !open);
      }
    };

    document.addEventListener('keydown', down);
    return () => document.removeEventListener('keydown', down);
  }, []);

  return (
    <>
      <CommandDialog open={open} onOpenChange={setOpen}>
        <CommandInput placeholder="Type something to search..." />
        <CommandList>
          <CommandEmpty>No results found.</CommandEmpty>
          <CommandGroup heading="Components">
            {entries.map((component) => (
              <CommandItem key={component.title}>
                <div
                  className="cursor-pointer w-full"
                  onClick={() => {
                    setOpen(false);
                  }}
                >
                  <a href={component.href} className="w-full h-full">
                    <div className="w-full h-full">
                      {component.title}
                    </div>
                  </a>
                </div>
              </CommandItem>
            ))}
          </CommandGroup>
        </CommandList>
      </CommandDialog>
    </>
  );
}
