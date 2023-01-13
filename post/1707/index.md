# psql修改所有表的所有者

<!--more-->
<pre class="pure-highlightjs"><code class="sql">\c 库名;
DO $$
DECLARE
    r record;
    i int;
    v_schema text[] := '{public}';
    v_new_owner varchar := '新的用户名';
BEGIN
    FOR r IN
        SELECT 'ALTER TABLE "' || table_schema || '"."' || table_name || '" OWNER TO ' || v_new_owner || ';' AS a FROM information_schema.tables WHERE table_schema = ANY (v_schema)
        UNION ALL
        SELECT 'ALTER TABLE "' || sequence_schema || '"."' || sequence_name || '" OWNER TO ' || v_new_owner || ';' AS a FROM information_schema.sequences WHERE sequence_schema = ANY (v_schema)
        UNION ALL
        SELECT 'ALTER TABLE "' || table_schema || '"."' || table_name || '" OWNER TO ' || v_new_owner || ';' AS a FROM information_schema.views WHERE table_schema = ANY (v_schema)
        UNION ALL
        SELECT 'ALTER FUNCTION "' || nsp.nspname || '"."' || p.proname || '"(' || pg_get_function_identity_arguments(p.oid) || ') OWNER TO ' || v_new_owner || ';' AS a FROM pg_proc p JOIN pg_namespace nsp ON p.pronamespace = nsp.oid WHERE nsp.nspname = ANY (v_schema)
        UNION ALL
        SELECT 'ALTER DATABASE "' || current_database() || '" OWNER TO ' || v_new_owner
    LOOP
        EXECUTE r.a;
    END LOOP;
    FOR i IN array_lower(v_schema, 1)..array_upper(v_schema, 1)
    LOOP
        EXECUTE 'ALTER SCHEMA "' || v_schema[i] || '" OWNER TO ' || v_new_owner;
    END LOOP;
END
$$;</code></pre>
&nbsp;


---

> 作者: [SoulChild](https://www.soulchild.cn)  
> URL: https://www.soulchild.cn/post/1707/  

