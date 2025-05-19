import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { User } from "@/types/global.types";
import { getCurrentUser, setCurrentUser } from "@/utils/user";
import { Check, ChevronsUpDown } from "lucide-react";
import { useState } from "react";

interface SwitcherProps {
    data: User[];
    title: string;
}

export default function Switcher({
    data,
    title
}: SwitcherProps) {
  const [selected, setSelected] = useState(data.find((account) => account.id === getCurrentUser().id));

  if (!selected) {
    setSelected(data[0]);
    setCurrentUser(data[0]);
  }

  const handleAccountChange = (account: {
    id: string;
    firstName: string;
    lastName: string;
    email: string;
  }) => {
    setSelected(account);
    setCurrentUser(account);
    window.location.reload();
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger className="flex items-center gap-2 py-2.5 px-3 rounded-lg hover:cursor-pointer hover:bg-black/10 transition-all duration-150">
        <div className="text-start flex flex-col gap-1 leading-none">
          <span className="text-sm leading-none font-semibold truncate max-w-[17ch]">
            {selected.firstName}&nbsp;{selected.lastName}
          </span>
          <span className="text-xs text-muted-foreground truncate max-w-[20ch]">
            {selected.email}
          </span>
        </div>
        <ChevronsUpDown className="ml-6 h-4 w-4 text-muted-foreground" />
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-full" align="center">
        <DropdownMenuLabel>{title}</DropdownMenuLabel>
        {data.map((entry) => (
          <DropdownMenuItem
            key={entry.firstName}
            onClick={() => handleAccountChange(entry)}
          >
            <div className="flex items-center gap-2">
              
              <div className="flex flex-col">
                <span>{entry.firstName}&nbsp;{entry.lastName}</span>
                <span className="text-xs text-muted-foreground">
                  {entry.email}
                </span>
              </div>
            </div>
            {selected.email === entry.email && (
              <Check className="ml-auto" />
            )}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}