'use client'
import { useEffect } from 'react'
import { initScholion } from '@samisdat/codeprose/scholion/controller'

export function ScholionController() {
    useEffect(() => initScholion(), [])
    return null
}
