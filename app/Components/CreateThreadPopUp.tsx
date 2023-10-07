"use client";
import { FiX } from "react-icons/fi";
import Draggable from "react-draggable";
import { useContext, useEffect } from "react";
import { TestContext } from "../context";
import React from "react";
import { ThreadI, ThreadIfb, ThreadSkeletonI, MediaI } from "../interfaces";
import { getAllThreads, usePostThread } from "../api-utils";
//import uuid
import uuid from "react-uuid";

const CreateThreadPopUp = () => {
    const {
        clickedCreateThread,
        SetClickedCreateThread,
        titleTextareaInput,
        textareaInput,
        SetTitleTextareaInput,
        SetTextareaInput,
        SetThreadImage,
        threadImage,
        highlightEmptyField,
        SetHighlightEmptyField,
        setThreads,
    } = useContext(TestContext);

    const { isLoading, error, success, postThread } = usePostThread();

    const closeCreateThread = () => {
        SetClickedCreateThread(false);
        SetTextareaInput("");
        SetTitleTextareaInput("");
        SetThreadImage({});
    };

    useEffect(() => {
        if (success) {
            SetTitleTextareaInput("");
            SetTextareaInput("");
            SetThreadImage("");
            SetClickedCreateThread(false);
            getAllThreads()
                .then((threads) => {
                    setThreads(threads);
                })
                .catch((err) => {
                    console.log(err);
                });
        }
    }, [success]);

    return (
        <>
            {clickedCreateThread && (
                <Draggable handle=".ThreadModalTopBar">
                    <div
                        className="ThreadTypeWindow"
                        style={{ position: "fixed" }}
                    >
                        <div className="ThreadModalTopBar" id="#topbar">
                            <a
                                className="HyperText"
                                onClick={closeCreateThread}
                            >
                                <FiX size={25} />
                            </a>
                        </div>
                        <a className="HyperText" style={{ cursor: "auto" }}>
                            Thread Title:
                        </a>
                        <textarea
                            style={{
                                backgroundColor: highlightEmptyField
                                    ? "rgba(66, 25, 25,0.5)"
                                    : "rgb(66, 64, 64)",
                            }}
                            className="ThreadTitleInputArea"
                            value={titleTextareaInput}
                            onChange={(e) =>
                                SetTitleTextareaInput(e.target.value)
                            }
                        ></textarea>
                        <a className="HyperText" style={{ cursor: "auto" }}>
                            Thread Content:
                        </a>
                        <textarea
                            style={{
                                backgroundColor: highlightEmptyField
                                    ? "rgba(66, 25, 25,0.5)"
                                    : "rgb(66, 64, 64)",
                            }}
                            className="ThreadInputArea"
                            value={textareaInput}
                            onChange={(e) => SetTextareaInput(e.target.value)}
                        ></textarea>
                        <div>
                            <a
                                className="HyperText"
                                style={{ cursor: "auto", float: "left" }}
                            >
                                Thread media:
                            </a>
                            <br />
                            <br />
                            <div>
                                <label className="FileInputPrompt HyperText">
                                    {!threadImage
                                        ? "Select Image"
                                        : threadImage.media.file_name}
                                    <input
                                        style={{ display: "none" }}
                                        type="file"
                                        accept="image/*"
                                        onChange={(event) => {
                                            const fileList =
                                                event.target.files &&
                                                event.target.files[0];
                                            if (!fileList) return;
                                            const media: MediaI = {
                                                media_id: uuid().slice(0, 10),
                                                url: null,
                                                file_type: fileList.type,
                                                kilobytes: fileList.size / 1000,
                                                file_name: fileList.name,
                                            };
                                            SetThreadImage({
                                                media: media,
                                                file: fileList,
                                            });
                                        }}
                                    />
                                </label>
                            </div>
                        </div>
                        {isLoading ? (
                            <h2
                                className="HyperText"
                                style={{ textAlign: "center" }}
                            >
                                Posting...
                            </h2>
                        ) : (
                            <h2
                                className="HyperText"
                                style={{ textAlign: "center" }}
                                onClick={() => {
                                    if (isLoading) return;
                                    if (
                                        titleTextareaInput.length === 0 ||
                                        textareaInput.length === 0
                                    ) {
                                        SetHighlightEmptyField(true);
                                        return;
                                    }

                                    SetHighlightEmptyField(false);

                                    const thread: ThreadIfb = {
                                        thread_id: 0,
                                        body: textareaInput,
                                        created_at: new Date()
                                            .toISOString()
                                            .slice(0, 19)
                                            .replace("T", " "),
                                        last_updated: new Date()
                                            .toISOString()
                                            .slice(0, 19)
                                            .replace("T", " "),
                                        title: titleTextareaInput,
                                        image: threadImage
                                            ? threadImage.media.media_id
                                            : null,
                                    };

                                    if (threadImage.media) {
                                        console.log(threadImage);
                                        postThread(
                                            thread,
                                            threadImage.media,
                                            threadImage.file
                                        );
                                        return;
                                    }
                                    //postThread(thread);
                                }}
                            >
                                [Submit]
                            </h2>
                        )}
                        <h3
                            style={{
                                backgroundColor: "rgba(255,50,50,0.7)",
                                textAlign: "center",
                            }}
                        >
                            {error && error}
                        </h3>
                    </div>
                </Draggable>
            )}
        </>
    );
};

export default CreateThreadPopUp;
