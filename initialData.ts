import { DocType } from "../models/users";
import { GuestService } from "../services/guest";
import { UserService } from "../services/user";
import { Role } from "./session";
import {GuestDTO} from "../models/guest";

export class InitialData {

    async init() {
        await this.createInitialUsers();
        await this.createInitialPatients();
    }

    async createInitialUsers() {
        try {
            const us = new UserService();
            const users = this.getInitialUsers();
            await Promise.all(users.map(async user => {
                await us.save(user);
            }));
        } catch (err) {
            console.log(err);
        }
    }

    async createInitialPatients() {
        try {
            const patients = this.getInitialPatients();
            await Promise.all(patients.map(async patients => {
                await GuestService.registry(patients);
            }));
        } catch (err) {
            console.log(err);
        }
    }

    getInitialUsers() {
        // TODO: hide in .env files
        return [
            {
                username: 'admin',
                password: 'admin',
                email: '',
                firstName: 'first name',
                lastName: 'last name',
                docType: DocType.DNI,
                birthDate: new Date(),
                role: [Role.ROOT, Role.ADMIN]
            },
        ];
    }

    getInitialPatients(): GuestDTO[] {
        // TODO: hide in .env files
        return [
            {
                username: '12345678',
                password: '12345678',
                email: '',
                firstName: 'first name',
                lastName: 'last name',
                docType: DocType.DNI,
                birthDate: new Date(),
                role: [Role.PG],
                FUM: new Date(),
                gender: 'mujer'
            },
        ];
    }
}