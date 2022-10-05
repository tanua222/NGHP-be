SELECT  
    y.EXCH_ABBREV,
    y.BOOK_NUM,
    y.EXCH_FULL_NAME,
    y.EXCH_ABBREV_2,
    y.SECTION_NUM,
    y.CREATE_USER_ID,
    y.LAST_UPDT_USER_ID,
    y.CREATE_TS,
    y.LAST_UPDT_TS,
    bnem.npa_exch_id    AS bnem_npa_exch_id,
    bnem.npa            AS bnem_npa,
    -- result_count as part header. we will have a look later 
    result_count
FROM ( 
        SELECT
            *
        FROM
            (
                SELECT
                    ROW_NUMBER() OVER( ORDER BY exch_abbrev DESC) rn,
                    COUNT(*) OVER()   AS result_count,
                    x.*
                FROM
                    (
                        SELECT
                            bem.EXCH_ABBREV,
                            bem.BOOK_NUM,
                            bem.EXCH_FULL_NAME,
                            bem.EXCH_ABBREV_2,
                            bem.SECTION_NUM,
                            bem.CREATE_USER_ID,
                            bem.LAST_UPDT_USER_ID,
                            bem.CREATE_TS,
                            bem.LAST_UPDT_TS
                        FROM
                            blif_exch_mtnc bem
                            -- 2: added `datatableInParams.sKeyword != undefined and +`
        --                             <if test="datatableInParams.sKeyword != undefined and datatableInParams.sKeyword != null and datatableInParams.sKeyword != ''"> 
        --                                 WHERE upper(bem.exch_abbrev) LIKE '%'||upper(trim(#{datatableInParams.sKeyword}))||'%'
        --                                    OR upper(bem.exch_full_name) LIKE '%'||upper(trim(#{datatableInParams.sKeyword}))||'%'
        --                                    OR upper(bem.exch_abbrev_2) LIKE '%'||upper(trim(#{datatableInParams.sKeyword}))||'%'
        --                                    OR bem.book_num LIKE '%'||trim(#{datatableInParams.sKeyword})||'%'
        --                                    OR bem.section_num LIKE '%'||trim(#{datatableInParams.sKeyword})||'%'
        --                             </if>
                    ) x
            ) 
--        3: WHERE rn BETWEEN ${datatableInParams.displayStart} AND ${datatableInParams.displayEnd}
        WHERE rn BETWEEN 0 AND 10
        ORDER BY rn
		  ) y
LEFT OUTER JOIN blif_npa_exch_mtnc bnem ON ( y.exch_abbrev = bnem.exch_abbrev )
-- 3: OFFSET ${paginationParam.offset} ROWS FETCH NEXT (${paginationParam.offset}+${paginationParam.limit}) ROWS ONLY;
--OFFSET 0 ROWS FETCH NEXT 10 ROWS ONLY;