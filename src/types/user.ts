export interface User {
    name: UserName;
    email: string;
    picture: UserPicture;
    location: UserLocation;
    id: string;
}

export interface UserName {
    title: string;
    first: string;
    last: string;
}

export interface UserPicture {
    medium: string;
}

export interface UserLocation {
    country: string;
    city: string;
    street: {
        name: string;
        number: number;
    };
}

export const createUser = (user?: User): User => {
    if (user) {
        return {
            name: {
                title: user.name.title,
                first: user.name.first,
                last: user.name.last,
            },
            email: user.email,
            picture: {
                medium: user.picture.medium,
            },
            location: {
                country: user.location.country,
                city: user.location.city,
                street: {
                    name: user.location.street.name,
                    number: user.location.street.number,
                },
            },
            id: user.id,
        }
    }
    return {
        name: {
            title: '',
            first: '',
            last: '',
        },
        email: '',
        picture: {
            medium: '',
        },
        location: {
            country: '',
            city: '',
            street: {
                name: '',
                number: 0,
            },
        },
        id: '',
    };
}

