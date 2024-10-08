"use client";
import React from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

function CommonCard({icon, title, companyName, footerContent}) {
  return (
    <Card className="flex bg-gray-200 dark:bg-gray-900 flex-col gap-6 rounded-2xl p-8 transition duration-300 hover:bg-gray-300 dark:hover:bg-gray-950 shadow-lg shadow-gray-600/10 cursor-pointer">
      <CardHeader className="p-0 ">
        {
            icon ? icon : null
        }
        {
            title ? <CardTitle className="text-xl max-w-[250px] text-ellipsis overflow-hidden whitespace-nowrap font-semibold text-gray-950 dark:text-white">{title}</CardTitle> : null
        }
        {
            companyName ? <CardDescription className="mt-3 text-gray-600 dark:text-gray-400">{companyName}</CardDescription> : null
        }
      </CardHeader>
      <CardFooter className="self-start p-0">
        {footerContent}
      </CardFooter>
    </Card>
  );
}

export default CommonCard;
