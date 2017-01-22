import expect from "expect";

import { Users } from "./users";

describe("Users", () => {

    let users;

    beforeEach(() => {
        users = new Users();
        users.users = [{
            id: "1",
            name: "Yogesh",
            room: "node"
        }, {
            id: "2",
            name: "Neeraj",
            room: "react"
        },{
            id: "3",
            name: "Prashant",
            room: "node"
        }];
    });

    it("should add new user", () => {
        let users = new Users();
        let user = {
            id: "123",
            name: "Yogesh",
            room: "node"
        };
        let resUser = users.addUser(user.id, user.name, user.room);

        expect(users.users).toEqual([user]);
    });

    it("should remove a user",() => {
        let userId = "1";
        var user = users.removeUser(userId);

        expect(user.id).toBe(userId);
        expect(users.users.length).toBe(2);
    });

    it("should not remove a user",() => {
        let userId = "99";
        var user = users.removeUser(userId);

        expect(user).toNotExist();
        expect(users.users.length).toBe(3);
    });

    it("should find user",() => {
        let userId = "2";
        let user = users.getUser(userId);
        expect(user.id).toBe(userId); 
    });

    it("should not find user",() => {
        let userId = "99";
        let user = users.getUser(userId);
        expect(user).toNotExist(); 
    });

    it("should return names for 'node' chat room", () => {
        let userList = users.getUserList("node");
        expect(userList).toEqual(["Yogesh", "Prashant"]);
    });

    it("should return names for 'react' chat room", () => {
        let userList = users.getUserList("react");
        expect(userList).toEqual(["Neeraj"]);
    });
});