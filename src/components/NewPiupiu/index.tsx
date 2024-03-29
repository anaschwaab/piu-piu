import { FormEvent, useMemo, useState } from "react";
import { ProfilePic } from "../ProfilePic";
import { Button } from "../Button";
import sound from "../../assets/E o pintinho piu.mp3";
import { Textarea } from "../Textarea";
import { DeletableImage } from "../DeletableImage";
import { checkForImageLinks } from "../../helpers";
// import { postPiu } from "../../service";
// import { useNavigate, useParams } from "react-router-dom";

type NewPiupiuProps = {
  user: {
    handle: string;
    name: string;
    image_url: string;
  };
  value?: string;
  onChange?: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
  onSubmit?: (e: FormEvent, textValue: string) => void;
  placeholder?: string;
  variant?: "new" | "reply" | "borderless";
  loading?: boolean;
};

export const NewPiupiu = ({
  user,
  value,
  placeholder,
  variant = "new",
  onChange,
  onSubmit,
  loading,
}: NewPiupiuProps) => {
  const [isActive, setIsActive] = useState(false);
  const [error, setError] = useState(false);
  const [foundLinks, setFoundLinks] = useState("");
  const piupiuSound = useMemo(() => new Audio(sound), []);


  const placeholderText = useMemo(
    () =>
      placeholder || variant === "reply"
        ? "Prove que essa pessoa está errada!"
        : "O que tá pegando?!",
    [placeholder, variant]
  );

  const handleTextChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    if (e.target.value.length > 240) {
      setError(true);
      e.target.value = e.target.value.slice(0, 240);
      onChange?.(e);
      return;
    }
    e.target.value = checkForImageLinks(e.target.value, (imageUrl) => {
      if (!foundLinks || foundLinks !== imageUrl) {
        setFoundLinks(imageUrl);
      }
    });

    error && setError(false);
    onChange?.(e);
  };

  const sendForm = async (e: FormEvent) => {
    e.preventDefault();
    onSubmit?.(e, foundLinks ? `${value} ${foundLinks}` : value || "");
    setFoundLinks("");
    piupiuSound.play();
  };

  return (
    <article
      className={`flex resize-none overflow-y-hidden ${
        variant === "borderless"
          ? ""
          : " border-[#2f3336] border-t-0  border-[1px]"
      } select-none w-full h-min px-4 py-2 focus:outline-none`}
    >
      <ProfilePic userName={user.name} image={user.image_url} />
      <form
        onSubmit={sendForm}
        className={`w-full px-3 flex justify-end ${
          variant === "new" ? "flex-col" : "items-center"
        }`}
      >
        <div className="w-full text-xl resize-none overflow-y-hidden py-2.5 px-1 caret-primary bg-transparent focus:outline-none">
          <Textarea
            rows={1}
            value={value}
            onClick={() => setIsActive(true)}
            placeholder={placeholderText}
            onChange={handleTextChange}
          />
          {foundLinks && (
            <DeletableImage
              onDelete={() => setFoundLinks("")}
              src={foundLinks}
            />
          )}
        </div>
        {isActive && <hr className="my-3 border-t-[1px] border-[#2f3336]" />}
        <div className="flex">
          {error && (
            <span className="text-red-500 text-sm w-50">
              Piupiu deve ter no máximo 240 caracteres
            </span>
          )}
          <div className="ml-auto w-28">
            <Button
              loading={loading}
              disabled={!value || error}
              type="submit"
              variant="secondary"
            >
              Piar
            </Button>
          </div>
        </div>
      </form>
    </article>
  );
};

export default NewPiupiu;
