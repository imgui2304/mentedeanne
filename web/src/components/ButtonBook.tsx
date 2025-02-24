
interface ButtonBookProps {

    title: string;

    onClick: () => void;

}

export const ButtonBook = ({ title }: ButtonBookProps) => {
    return (
        <button className="flex flex-col items-start w-full bg-custom-black text-white p-3 rounded-[5px] hover:cursor-pointer">{title}</button>

    )
}