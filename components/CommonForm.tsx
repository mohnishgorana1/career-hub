import React from "react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Loader, Loader2, LoaderCircle } from "lucide-react";

function CommonForm({
  action,
  formControls,
  buttonText,
  isButtonDisabled,
  btnType,
  formData,
  setFormData,
  handleFileChange,
  isShowLoadingButton,
}: CommonFormType) {
  const renderInputByComponentsType = (getCurrentControl: FormControl) => {
    let content = null;

    switch (getCurrentControl.componentType) {
      case "INPUT":
        content = (
          <div className="grid grid-cols-3 md:grid-cols-12 w-full items-center justify-between mt-8">
            <Label className="col-span-1 md:col-span-3 text-sm">
              {getCurrentControl.label}
            </Label>
            <Input
              type="text"
              disabled={getCurrentControl.disabled}
              placeholder={getCurrentControl.placeholder}
              name={getCurrentControl.name}
              id={getCurrentControl.name}
              value={formData?.[getCurrentControl.name] || ""}
              onChange={(event) =>
                setFormData &&
                setFormData({
                  ...formData,
                  [event.target.name]: event.target.value,
                })
              }
              className="col-span-2 md:col-span-9 min-w-full rounded-md h-[40px] md:h-[60px] px-4 border dark:bg-black 
                                bg-gray-100 text-xm md:text-lg outline-none drop-shadow-sm 
                                transition-all duration-200 ease-in-out 
                                focus:bg-white focus:drop-shadow-lg focus-visible:outline-none 
                                focus-visible:ring-0 focus-visible:ring-offset-0"
            />
          </div>
        );
        break;

      case "FILE":
        content = (
          <Label
            htmlFor={getCurrentControl.name}
            className="flex bg-gray-100 dark:bg-black items-center px-3 py-3 mx-auto mt-6 text-center
                         border-2 border-dashed rounded-lg cursor-pointer"
          >
            <h2>{getCurrentControl.label}</h2>
            <Input
              onChange={handleFileChange}
              id={getCurrentControl.name}
              type="file"
            />
          </Label>
        );
        break;

      default:
        content = (
          <div className="relative flex items-center mt-8">
            <Input
              type="text"
              disabled={getCurrentControl.disabled}
              placeholder={getCurrentControl.placeholder}
              name={getCurrentControl.name}
              id={getCurrentControl.name}
              value={formData[getCurrentControl.name]}
              onChange={(event) =>
                setFormData({
                  ...formData,
                  [event.target.name]: event.target.value,
                })
              }
              className="w-full dark:bg-black rounded-md h-[60px] px-4 border bg-gray-100 text-lg outline-none drop-shadow-sm transition-all duration-200 ease-in-out focus:bg-white focus:drop-shadow-lg focus-visible:outline-none focus-visible:ring-0 focus-visible:ring-offset-0"
            />
          </div>
        );
        break;
    }

    return content;
  };

  return (
    <form action={action} className="flex flex-col w-full">
      {formControls.map((control) => renderInputByComponentsType(control))}
      <div className="my-6 w-full">
        <Button
          disabled={isButtonDisabled}
          type={btnType || "submit"}
          className={`${
            isButtonDisabled && "opacity-50 cursor-not-allowed"
          } flex h-11 items-center justify-center px-5`}
        >
          {isShowLoadingButton ? (
            <LoaderCircle className="animate-spin" />
          ) : (
            buttonText
          )}
        </Button>
      </div>
    </form>
  );
}

export default CommonForm;
