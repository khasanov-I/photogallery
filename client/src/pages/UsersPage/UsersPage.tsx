import { observer } from "mobx-react-lite"
import { useCallback, useEffect, useRef, useState } from "react"
import { useStores } from "../../store/rootStore"
import { Grid, Input, Link, Stack, TextField } from "@mui/material"

export const UsersPage = observer(() => {

    const { searchUserStore } = useStores()

    const timeoutRef = useRef<NodeJS.Timeout>(null)

    const onChangeName = useCallback((value: string) => {
        if (timeoutRef.current) {
            clearTimeout(timeoutRef.current);
        }
        timeoutRef.current = setTimeout(async () => {
            await searchUserStore.getAll(value);
        }, 300);
    }, [searchUserStore])

    useEffect(() => {
        searchUserStore.getAll('')
    }, [searchUserStore])

    return <Stack width={"100%"} spacing={2}>
        <TextField onChange={(event) => onChangeName(event.target.value)} label="Введите имя пользователя" />
        {searchUserStore.error ? <span style={{color: "red"}}>Произошла ошибка</span> : undefined}
        {searchUserStore.users.length === 0 && !searchUserStore.isLoading ? <span>Пользователи не найдены</span> : undefined}
        <Grid container spacing={2}>
            {searchUserStore.users.map(e => {
                return <Grid key={e.id}>
                    <Link href={`/profile/${e.id}`} style={{ cursor: "pointer" }}>
                        {e.name}
                    </Link>
                </Grid>
            })}
        </Grid>
    </Stack>
})