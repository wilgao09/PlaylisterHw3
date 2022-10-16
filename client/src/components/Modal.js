import React, { useEffect, useRef } from "react";

export default function (props) {
    const ref = useRef(null);

    useEffect(() => {
        // console.log("VVVV");
        // console.log(ref);
        // console.log("^^^^");
        setTimeout(() => {
            if (!ref.current) return;
            ref.current.classList.add("is-visible");
        }, 1);
    });

    return (
        <div ref={ref} className="modal">
            <div className="modal-dialog">
                <div className="modal-header">{props.title}</div>
                <div className="modal-center">{props.children}</div>

                <div
                    className="modal-footer"
                    style={{
                        display: "flex",
                        flexDirection: "row",
                        justifyContent: "center",
                    }}
                >
                    <input
                        type="button"
                        value="Confirm"
                        style={{ marginRight: "10%" }}
                        onClick={() => {
                            ref.current.classList.remove("is-visible");
                            setTimeout(props.confirm, 300);
                        }}
                    />
                    <input
                        type="button"
                        value="Cancel"
                        style={{ marginLeft: "10%" }}
                        onClick={() => {
                            ref.current.classList.remove("is-visible");
                            setTimeout(props.cancel, 300);
                        }}
                    />
                </div>
            </div>
        </div>
    );
}
