"use client";

import React, { useEffect, useRef } from "react";
import { ConfirmDialog, confirmDialog } from "primereact/confirmdialog";
import { Toast } from "primereact/toast";
import { Button } from "primereact/button";
import "primereact/resources/themes/lara-light-blue/theme.css";
import "primereact/resources/primereact.min.css";
import "primeicons/primeicons.css";


interface DeleteConfirmProps {
  DeleteTrue: () => void;
  name: string;
  actionType: "delete" | "block" | "reject" | "remove";
  onCancel?: () => void;
}

const DELETE_CONFIRM: React.FC<DeleteConfirmProps> = ({ DeleteTrue, name, actionType, onCancel }) => {
  const toast = useRef<any>(null);

  const reject = () => {
    toast.current?.show({
      severity: "warn",
      summary: "Cancelled",
      detail: "Action cancelled",
      life: 3000,
    });
  };

  useEffect(() => {
    let header = "";
    let message = "";
    let group = "";

    if (actionType === "delete") {
      header = "Delete Confirmation";
      message = `Do you want to delete ${name}?`;
      group = "deleteConfirm";
    } else if (actionType === "block") {
      header = "Block Confirmation";
      message = `Do you want to block ${name}?`;
      group = "blockConfirm";
    } else if (actionType === "reject") {
      header = "Rejection Confirmation";
      message = `Do you want to reject ${name}'s post?`;
      group = "rejectConfirm";
    }

    confirmDialog({
      group,
      message,
      header,
      icon: "pi pi-exclamation-triangle",
      defaultFocus: "accept",
      reject,
    });
  }, [name, actionType]);
  

  return (
    <>
      <Toast ref={toast} />
      <ConfirmDialog
        group={
          actionType === "delete"
            ? "deleteConfirm"
            : actionType === "block"
            ? "blockConfirm"
            : "rejectConfirm"
        }
        content={({ headerRef, contentRef, footerRef, hide, message }: any) => {
          const { header, message: msg } = message;
          return (
            <div className="flex flex-col items-center p-4 bg-white rounded-lg shadow-lg">
              <div className="rounded-full bg-black text-white flex justify-center items-center h-20 w-20 mt-3">
                <i className="pi pi-question text-4xl"></i>
              </div>
              <span ref={headerRef} className="font-bold text-lg mt-4 mb-2 text-center">
                {header}
              </span>
              <p ref={contentRef} className="text-gray-700 text-center text-sm">
                {msg}
              </p>
              <div ref={footerRef} className="flex gap-3 mt-5">
                <Button
                  label="Cancel"
                  outlined
                  onClick={(e: any) => {
                    hide(e);
                    reject();
                    onCancel?.();
                  }}
                  style={{
                    background: "#000",
                    color: "#fff",
                    padding: "10px 20px",
                    fontSize: "15px",
                    borderRadius: "8px",
                  }}
                />
                <Button
                  label="OK"
                  onClick={(e: any) => {
                    hide(e);
                    toast.current?.show({
                      severity:
                        actionType === "delete"
                          ? "error"
                          : actionType === "block"
                          ? "warn"
                          : "info",
                      summary:
                        actionType === "delete"
                          ? "Deleted"
                          : actionType === "block"
                          ? "Blocked"
                          : "Rejected",
                      detail:
                        actionType === "delete"
                          ? `${name} has been deleted`
                          : actionType === "block"
                          ? `${name} has been blocked`
                          : `${name}'s post has been rejected`,
                      life: 3000,
                    });
                    setTimeout(() => DeleteTrue(), 200);
                  }}
                  style={{
                    background:
                      actionType === "delete"
                        ? "#dc2626"
                        : actionType === "block"
                        ? "#f97316"
                        : "#9c27b0",
                    color: "#fff",
                    padding: "10px 20px",
                    fontSize: "15px",
                    borderRadius: "8px",
                  }}
                />
              </div>
            </div>
          );
        }}
      />
    </>
  );
};

export default DELETE_CONFIRM;