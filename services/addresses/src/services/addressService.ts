import Address from '../models/Address';

export const getAllAddresses = async (): Promise<Address[]> => {
    return await Address.findAll();
};

export const getAddressById = async (id: string): Promise<Address | null> => {
    return await Address.findByPk(id);
};

export const createNewAddress = async (addressData: {
    streetNumber: string;
    complement?: string;
    street: string;
    postalCode: string;
    city: string;
    country: string;
}): Promise<Address> => {
    return await Address.create(addressData);
};

export const updateAddressData = async (id: string, addressData: any): Promise<Address | null> => {
    const address = await Address.findByPk(id);

    if (!address) {
        return null;
    }

    await address.update(addressData);
    return address;
};

export const removeAddress = async (id: string): Promise<boolean> => {
    const address = await Address.findByPk(id);

    if (!address) {
        return false;
    }

    await address.destroy();
    return true;
};