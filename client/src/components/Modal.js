import React from "react";

export default function (props) {
    return (
        <div className="modal is-visible">
            <div className="modal-dialog">
                <div className="modal-header">{props.title}</div>
                <div className="modal-center">{props.children}</div>

                <div className="modal-footer">
                    <input
                        type="button"
                        value="Confirm"
                        onClick={props.confirm}
                    />
                    <input
                        type="button"
                        value="Cancel"
                        onClick={props.cancel}
                    />
                </div>
            </div>
        </div>
    );
}
