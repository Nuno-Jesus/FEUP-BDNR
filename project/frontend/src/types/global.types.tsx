export type User = {
    id: string;
    firstName: string;
    lastName: string;
    email: string;
}

export type Review = {
    user: string;
    date: string;
    score: number;
    title: string;
    text: string;
}

export type Address = {
    street: string;
    city: string;
    state: string;
    zip: string;
}

export type Order = {
    id: number;
    userId: number;
    date: string;
    items: Product[];
    address: Address;
}

export type BaseProduct = {
    id: number;
    name: string;
    price: number;
    currency: string;
    quantity?: number;
    stock: number;
    category: 'CaseAccessory' | 'CaseFan' | 'Case' | 'CpuCooler' | 'Cpu' | 'ExternalHardDrive' | 'FanController' | 'Headphones' | 'InternalHardDrive' | 'Keyboard' | 'Memory' | 'Monitor' | 'Motherboard' | 'Mouse' | 'Os' | 'PowerSupply' | 'SoundCard' | 'ThermalPaste' | 'VideoCard' | 'Webcam';
    image: string;
    discount: number;
    attributes: Record<string, any>;
    reviews: Review[];
}

export type CaseAccessoryProduct = BaseProduct & {
    category: 'CaseAccessory';
    attributes: {
        accessoryType: string;
        formFactor: string;
    }
}

export type CaseFanProduct = BaseProduct & {
    category: 'CaseFan';
    attributes: {
        size: string;
        color: string;
        rpm: number;
        airflow: string;
        noiseLevel: string;
        pwm: boolean;
    }
}

export type CaseProduct = BaseProduct & {
    category: 'Case';
    attributes: {
        caseType: string;
        color: string;
        psu: string;
        sidePanel: string;
        externalVolume: string;
        internal35Bays: number;
    }
}

export type CpuCoolerProduct = BaseProduct & {
    category: 'CpuCooler';
    attributes: {
        rpm: number;
        noiseLevel: string;
        color: string;
        size: string;
    }
}

export type CpuProduct = BaseProduct & {
    category: 'Cpu';
    attributes: {
        coreCount: number;
        coreClock: string;
        boostClock: string;
        tdp: string;
        graphics: string;
        smt: boolean;
    }
}

export type ExternalHardDriveProduct = BaseProduct & {
    category: 'ExternalHardDrive';
    attributes: {
        driveType: string;
        interface: string;
        capacity: string;
        pricePerGb: string;
        color: string;
    }
}

export type FanControllerProduct = BaseProduct & {
    category: 'FanController';
    attributes: {
        channels: number;
        channelWattage: string;
        pwm: boolean;
        formFactor: string;
        color: string;
    }
}

export type HeadphonesProduct = BaseProduct & {
    category: 'Headphones';
    attributes: {
        headphonesType: string;
        frequencyResponse: string;
        microphone: boolean;
        wireless: boolean;
        enclosureType: string;
        color: string;
    }
}

export type InternalHardDriveProduct = BaseProduct & {
    category: 'InternalHardDrive';
    attributes: {
        capacity: string;
        pricePerGb: string;
        driveType: string;
        cache: string;
        formFactor: string;
        interface: string;
    }
}

export type KeyboardProduct = BaseProduct & {
    category: 'Keyboard';
    attributes: {
        style: string;
        switches: string;
        backlit: boolean;
        tenkeyless: boolean;
        connectionType: string;
        color: string;
    }
}

export type MemoryProduct = BaseProduct & {
    category: 'Memory';
    attributes: {
        speed: string;
        modules: number;
        pricePerGb: string;
        color: string;
        firstWordLatency: string;
        casLatency: string;
    }
}

export type MonitorProduct = BaseProduct & {
    category: 'Monitor';
    attributes: {
        screenSize: string;
        resolution: string;
        refreshRate: string;
        responseTime: string;
        panelType: string;
        aspectRatio: string;
    }
}

export type MotherboardProduct = BaseProduct & {
    category: 'Motherboard';
    attributes: {
        socket: string;
        formFactor: string;
        maxMemory: string;
        memorySlots: number;
        color: string;
    }
}

export type MouseProduct = BaseProduct & {
    category: 'Mouse';
    attributes: {
        trackingMethod: string;
        connectionType: string;
        maxDpi: number;
        handOrientation: string;
        color: string;
    }
}

export type OsProduct = BaseProduct & {
    category: 'Os';
    attributes: {
        mode: string;
        maxMemory: string;
    }
}

export type PowerSupplyProduct = BaseProduct & {
    category: 'PowerSupply';
    attributes: {
        psuType: string;
        efficiency: string;
        wattage: string;
        modular: boolean;
        color: string;
    }
}

export type SoundCardProduct = BaseProduct & {
    category: 'SoundCard';
    attributes: {
        channels: number;
        digitalAudio: string;
        snr: string;
        sampleRate: string;
        chipset: string;
        interface: string;
    }
}

export type ThermalPasteProduct = BaseProduct & {
    category: 'ThermalPaste';
    attributes: {
        amount: string;
    }
}

export type VideoCardProduct = BaseProduct & {
    category: 'VideoCard';
    attributes: {
        chipset: string;
        memory: string;
        coreClock: string;
        boostClock: string;
        color: string;
        length: string;
    }
}

export type WebcamProduct = BaseProduct & {
    category: 'Webcam';
    attributes: {
        resolutions: string;
        connection: string;
        focusType: string;
        os: string;
        fov: string;
    }
}

export type Product =
    | CaseAccessoryProduct
    | CaseFanProduct
    | CaseProduct
    | CpuCoolerProduct
    | CpuProduct
    | ExternalHardDriveProduct
    | FanControllerProduct
    | HeadphonesProduct
    | InternalHardDriveProduct
    | KeyboardProduct
    | MemoryProduct
    | MonitorProduct
    | MotherboardProduct
    | MouseProduct
    | OsProduct
    | PowerSupplyProduct
    | SoundCardProduct
    | ThermalPasteProduct
    | VideoCardProduct
    | WebcamProduct; 