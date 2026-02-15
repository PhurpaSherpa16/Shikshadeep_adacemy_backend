import * as createProgram from './program/CreateProgram.js'
import * as updateProgram from './program/UpdateProgram.js'
import * as deleteProgram from './program/DeleteProgram.js'
import * as getSingleProgram from './program/GetSingleProgram.js'
import * as allPrograms from './program/AllPrograms.js'
import * as updateDisplayOrder from './program/UpdateDisplayOder.js'

export const programService = {
    ...createProgram,
    ...updateProgram,
    ...deleteProgram,
    ...getSingleProgram,
    ...allPrograms,
    ...updateDisplayOrder
}