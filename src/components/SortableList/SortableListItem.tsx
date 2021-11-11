import { ReactElement } from "react";
import { AiOutlineMenu, AiTwotoneDelete } from "react-icons/ai";

import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";

const SortableListItem = (props: {
  id: string;
  children: ReactElement;
  onDelete: (deleteId: string) => void;
}) => {
  const { id, onDelete } = props;

  const { attributes, listeners, setNodeRef, transform, transition } =
    useSortable({ id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <li className="sortlist__item" ref={setNodeRef} style={style}>
      <button
        type="button"
        aria-label={`Drag menu item ${id}`}
        {...attributes}
        {...listeners}
      >
        <AiOutlineMenu />
      </button>
      <div className="sortlist__item__name">{props.children}</div>
      <button
        type="button"
        aria-label={`Delete menu item ${id}`}
        onClick={() => onDelete(id)}
      >
        <AiTwotoneDelete />
      </button>
    </li>
  );
};

export default SortableListItem;
