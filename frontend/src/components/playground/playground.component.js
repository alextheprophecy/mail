import PersonQueue from "../person/personqueue.component";
import "../../styles/playground/playground.css";
import {useEffect, useState} from "react";

import axios from 'axios';

const Playground = () => {
    const LABELS = [["INBOX"], ["[Gmail]/Bin/health"]]//["INBOX", "CHAT", "SENT", "SPAM"]
    const COUNT = 8
    const [mails, setMails] = useState(new Array(LABELS.length).fill([]))
    const [pictures, setPictures] = useState(new Array(LABELS.length).fill([]))

    useEffect(() => {
        fetchMailsAndPictures(COUNT)
    }, []);

    /**
     * parallel fetch of mails by labels filters-> for each mail parallel fetch of people by mail senderEmail info -> concatenation of results as array for n labels of [mail informations for label i, picture for label i]
     * then stores data into states once all concurrent promises are handled
     */
    const fetchMailsAndPictures = (count) => {
        Promise.all(
            LABELS.map((label, i) => {
                return axios.get("http://localhost:4000/mails/mails", {
                    params: {
                        count: count,
                        labels: label
                    }
                }).then(resMails => {
                    if (resMails.data.length === 0)return Promise.resolve([])
                    return Promise.all(
                        resMails.data.map(mailInfo =>
                            axios.get("http://localhost:4000/people/person", {params: {email: mailInfo.senderEmail}})
                                .then(pics => [mailInfo, pics.data])
                        )
                    )
                })
            })
        ).then((res) => {
            setMails(
                LABELS.map((l, i) => res[i].map(e => e[0]))
            )
            setPictures(
                LABELS.map((l, i) => res[i].map(e => e[1]))
            )
        })
    }


    const listMails = (labelIndex) => {
        //TODO: (cosmetic) fade in people profiles

        return mails[labelIndex].map((m, i) => {
            return {picture: pictures[labelIndex][i], msg: m.subject, name: m.senderName}
        })
    }

    const personQueues = () => {
        return LABELS.map((l, i) =>
            <PersonQueue title={l[0]} list={listMails(i)}/>
        )
    }

    const writeMails = () => {
        return JSON.stringify(mails)

    }

    return (
        <div className="playground">
            {personQueues()}
        </div>
    )

}

export default Playground;