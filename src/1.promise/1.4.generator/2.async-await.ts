export const fn = async () => {
    await 1;
};


export var __awaiter: (
    thisArg: any, _arguments: Iterable<any>, P: PromiseConstructor, generator: Generator
) => Promise<unknown> = (this && (this as any).__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value: any) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value: any) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value?: any) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result: any) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
export const fn1: () => void = () => __awaiter(void 0, (void 0 as any), (void 0 as any), (function* () {
    yield 1;
} as any));
